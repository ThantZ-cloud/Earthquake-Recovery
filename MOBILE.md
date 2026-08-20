# Earthquake & Recovery — Android APK + Push Setup

This project has **two independent builds** that share the same source:

1. **Website** (`app/`) — your existing React + MUI + Leaflet app. **Never touched by the Android pipeline.**
2. **Android APK** (`android-app/`) — a Capacitor wrapper around the built website. The pipeline only *reads* `app/dist/`.

---

## Quick start — build an APK

### Option A: GitHub Actions (recommended, no local SDK needed)

1. Add these **repo secrets** (Settings → Secrets and variables → Actions):
   - `VITE_SUPABASE_URL` = `https://acegkfljicuqsvvuqvow.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = your publishable anon key

2. Tag a release and push:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. The workflow builds the APK in the cloud and attaches `app-debug.apk` to the release.

### Option B: Local build

```bash
cd android-app
npm install
npm run sync           # builds app/, copies dist -> web/, injects native bridge
npx cap add android    # first time only
npx cap sync android
cd android && ./gradlew assembleDebug
# -> android/app/build/outputs/apk/debug/app-debug.apk
```

**Requires** the Android SDK + Java 17+ locally.

---

## Push notifications (FCM)

Two halves must both be configured before pushes work.

### 1. Firebase

- Create a project at https://console.firebase.google.com
- Add an Android app with package name **`com.thantz.earthquakerecovery`**
- Download `google-services.json` and place it at:
  `android-app/android/app/google-services.json` (the workflow expects it as a secret if you build in CI — see below)
- In Firebase Project Settings → Service accounts → **Generate new private key** → save the JSON

### 2. Supabase Edge Function

The function `alert-dispatcher` is already deployed. It needs **two secrets** set in the
Supabase Dashboard → Edge Functions → `alert-dispatcher` → Secrets:

| Secret | Value |
|---|---|
| `FCM_SERVICE_ACCOUNT` | The full JSON contents of your Firebase service account key |
| `ALERT_DISPATCHER_TOKEN` | `d9ca447abad5db64269b401423a688b9ae42b9b978e1ac6a` (must match the cron job) |

Until `ALERT_DISPATCHER_TOKEN` is set, the function returns `401 Unauthorized`.

### 3. Cron job (already created)

Every 30 seconds Supabase calls the dispatcher (via `pg_cron` + `pg_net`). It:
- fetches EMSC quakes (M3+, last 60 min)
- matches against saved `locations`
- deduplicates via `alert_log`
- sends FCM notifications to `push_tokens`

---

## Required manual steps checklist

- [ ] Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` GitHub secrets
- [ ] Create Firebase project + Android app + `google-services.json`
- [ ] In CI: add `GOOGLE_SERVICES_JSON` secret (contents of `google-services.json`) and uncomment the step in `.github/workflows/build-apk.yml` that writes it
- [ ] Set `FCM_SERVICE_ACCOUNT` + `ALERT_DISPATCHER_TOKEN` secrets on the Supabase Edge Function
- [ ] Build the APK and upload the release
- [ ] Update `app/public/version.json` with the download URL so the in-app update banner appears

---

## How the pieces fit

```
app/ (React website)          android-app/ (Capacitor wrapper)
        |                             |
   npm run build                     |
        |                             |
     app/dist ──sync.mjs──▶ android-app/web/   (plus native-bridge.js injected)
        |                             |
        |                     npx cap sync android
        |                             |
        └──────────┐        gradlew assembleDebug
                   │                 │
                   │            app-debug.apk
                   │                 │
                   ▼                 ▼
          Hosted website      GitHub Release (share link)

Push:  EMSC ──pg_cron──▶ alert-dispatcher (Edge Function) ──FCM──▶ Android phones
```

The native bridge (`android-app/src/native-bridge.js`) runs only inside the
Android WebView. It registers the device's FCM token into `push_tokens`,
styles the status bar, handles the back button, and shows the in-app update
banner. In a normal web browser it's a complete no-op.
