import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// alert-dispatcher
//
// Polls EMSC for recent earthquakes (M3+, last 60 minutes) and sends an FCM
// push notification to every user whose saved location is within RADIUS_KM.
// Deduplicates via the alert_log table so a given (user, quake) is only ever
// pushed once.
//
// Scheduling: pg_cron job calls this function every 30 seconds with the
// ALERT_DISPATCHER_TOKEN bearer secret. See supabase/schedule.sql.
//
// Required secrets:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-injected)
//   FCM_SERVICE_ACCOUNT (JSON contents of a Firebase service account key)
//   ALERT_DISPATCHER_TOKEN (shared secret used by the cron job)
// ---------------------------------------------------------------------------

const EMSC_BASE = "https://www.seismicportal.eu/fdsnws/event/1/query";
const RADIUS_KM = 50;
const MIN_MAG = 3;
const LOOKBACK_MS = 60 * 60 * 1000; // 1 hour

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

// Haversine distance in km
function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const toR = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toR(b[0] - a[0]);
  const dLon = toR(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toR(a[0])) * Math.cos(toR(b[0])) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function fetchQuakes(): Promise<Array<Record<string, unknown>>> {
  const end = new Date();
  const start = new Date(end.getTime() - LOOKBACK_MS);
  const params = new URLSearchParams({
    format: "json",
    minmag: String(MIN_MAG),
    limit: "200",
    starttime: start.toISOString(),
    endtime: end.toISOString(),
  });
  const res = await fetch(`${EMSC_BASE}?${params}`, {
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`EMSC fetch failed: ${res.status}`);
  const data = await res.json();
  const features = data?.features ?? [];

  return features
    .map((f: any, i: number): any => {
      const [lon, lat] = f?.geometry?.coordinates ?? [];
      const mag = f?.properties?.mag;
      if (!lon || !lat || mag == null) return null;
      return {
        id: `${f.properties?.event_id || f.properties?.source_id || "eq"}-${i}`,
        lat,
        lon,
        mag,
        place: f.properties?.flynn_region || f.properties?.place || "Unknown",
        time: f.properties?.time,
      };
    })
    .filter(Boolean);
}

// FCM HTTP v1 messaging using a service account (JWT signed with RS256).
class FcmClient {
  private serviceAccount: any;
  private token: string | null = null;
  private tokenExpiry = 0;

  constructor(serviceAccountJson: string) {
    this.serviceAccount = JSON.parse(serviceAccountJson);
  }

  private base64UrlEncode(data: string | Uint8Array): string {
    const buf =
      typeof data === "string" ? new TextEncoder().encode(data) : data;
    let bin = "";
    for (const b of buf) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  private pemToArrayBuffer(pem: string): ArrayBuffer {
    const body = pem
      .replace(/-----BEGIN .*-----/, "")
      .replace(/-----END .*-----/, "")
      .replace(/\s+/g, "");
    const bin = atob(body);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf.buffer;
  }

  private async signJwt(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry - 60_000) return this.token;

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: this.serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    const key = await crypto.subtle.importKey(
      "pkcs8",
      this.pemToArrayBuffer(this.serviceAccount.private_key),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const unsigned = `${this.base64UrlEncode(JSON.stringify(header))}.${this.base64UrlEncode(
      JSON.stringify(payload)
    )}`;
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      key,
      new TextEncoder().encode(unsigned)
    );
    const jwt = `${unsigned}.${this.base64UrlEncode(new Uint8Array(signature))}`;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(`OAuth token exchange failed: ${JSON.stringify(data)}`);
    this.token = data.access_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1000;
    return this.token!;
  }

  async send(
    token: string,
    title: string,
    body: string,
    data: Record<string, string>
  ): Promise<void> {
    const accessToken = await this.signJwt();
    const projectId = this.serviceAccount.project_id;
    const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          data,
          android: { priority: "HIGH" },
        },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`FCM send failed (${res.status}): ${text.slice(0, 300)}`);
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Only accept scheduled invocations (bearer secret)
  const auth = req.headers.get("Authorization") ?? "";
  const expected = `Bearer ${Deno.env.get("ALERT_DISPATCHER_TOKEN") ?? ""}`;
  if (expected === "Bearer " || auth !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const serviceAccountJson = Deno.env.get("FCM_SERVICE_ACCOUNT") ?? "";

    if (!supabaseUrl || !serviceKey || !serviceAccountJson) {
      return new Response(
        JSON.stringify({ error: "Missing configuration" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });
    const fcm = new FcmClient(serviceAccountJson);

    const quakes = await fetchQuakes();
    if (quakes.length === 0) {
      return new Response(JSON.stringify({ ok: true, pushed: 0 }), {
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Users who have at least one push token AND a saved location
    const { data: subscribers, error: subErr } = await supabase
      .from("locations")
      .select("user_id, latitude, longitude, push_tokens(token)")
      .eq("push_tokens.platform", "android");

    if (subErr) throw subErr;

    let pushed = 0;
    let deduped = 0;

    for (const sub of subscribers ?? []) {
      const tokens = sub.push_tokens ?? [];
      if (!tokens.length) continue;
      const userPos: [number, number] = [sub.latitude, sub.longitude];

      for (const q of quakes) {
        const dist = haversineKm(userPos, [q.lat as number, q.lon as number]);
        if (dist > RADIUS_KM) continue;

        const { data: existing } = await supabase
          .from("alert_log")
          .select("id")
          .eq("user_id", sub.user_id)
          .eq("quake_id", q.id)
          .maybeSingle();

        if (existing) {
          deduped++;
          continue;
        }

        await supabase.from("alert_log").insert({
          user_id: sub.user_id,
          quake_id: q.id,
        });

        const title = `M${q.mag} earthquake`;
        const body = `${q.place} — ${dist.toFixed(1)} km away`;

        for (const t of tokens) {
          try {
            await fcm.send(t.token, title, body, {
              mag: String(q.mag),
              dist: dist.toFixed(1),
              place: String(q.place),
              quakeId: String(q.id),
            });
            pushed++;
          } catch (err: any) {
            console.error("[alert-dispatcher] FCM send failed:", err?.message);
            await supabase.from("push_tokens").delete().eq("token", t.token);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ ok: true, quakes: quakes.length, pushed, deduped }),
      {
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      }
    );
  } catch (err) {
    console.error("[alert-dispatcher] Exception:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      }
    );
  }
});
