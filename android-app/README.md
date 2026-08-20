# Earthquake & Recovery — Android wrapper

Self-contained Capacitor wrapper around the existing React website (`app/`).

The website project is **never modified** — this folder only reads `app/dist/`
(after `app` is built) and wraps it in an Android WebView shell.

## Prerequisites (CI does this automatically)

- Node.js 18+
- Java 17+ (for `gradlew`)
- Android SDK (GitHub Actions runners have it preinstalled)

## Local build

```bash
# From this folder
npm install

# 1. Build the website + copy dist into web/ + inject native bridge
npm run sync

# 2. Generate the native Android project (first time only)
npx cap add android

# 3. Sync web -> android + compile a debug APK
npm run build:apk
# -> android/app/build/outputs/apk/debug/app-debug.apk
```

## GitHub Actions (recommended)

Push a tag and the workflow in `.github/workflows/build-apk.yml` builds the APK
in the cloud (Android SDK preinstalled) and attaches it to the release.

```bash
git tag v1.0.0
git push origin v1.0.0
```

Required repo secrets (used by the workflow to configure the bridge):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## What `npm run sync` does

1. `npm run build` inside `app/`
2. copies `app/dist` → `web/`
3. bundles `src/native-bridge.js` → `web/native-bridge.js` (esbuild)
4. injects `window.__APP_CONFIG__` + the bridge `<script>` into `web/index.html`

The bridge:
- status bar styling
- FCM push registration → upserts into Supabase `push_tokens`
- in-app update banner via `version.json`
- back-button handling

## FCM push

- The bridge reads the auth session the web app stores in localStorage,
  restores it on its own Supabase client, and upserts the FCM token into
  `push_tokens`.
- A Supabase Edge Function (`alert-dispatcher`) polls EMSC and sends FCM
  notifications for quakes near saved locations. See
  `../supabase/functions/alert-dispatcher/`.
