/**
 * native-bridge.js
 * Runs ONLY inside the Capacitor Android WebView (no-op in a plain browser).
 *
 * Responsibilities:
 *   1. Style the status bar to match the app.
 *   2. Register the device with Firebase Cloud Messaging (FCM) and upsert the
 *      token into Supabase `push_tokens`, using the auth session the web app
 *      already stored in localStorage (so app/ stays pristine).
 *   3. Poll EMSC-compatible version.json and show an in-app update banner
 *      when the installed APK is older than the latest release.
 *   4. Back-button handling: exit the app when history is exhausted.
 *
 * Built with esbuild into a single IIFE injected into the web index.html.
 */
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { StatusBar } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { createClient } from '@supabase/supabase-js';

const config = window.__APP_CONFIG__ || {};
const { supabaseUrl, supabaseAnonKey, appVersion } = config;

function isNative() {
  return Boolean(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
}

// Derive the localStorage key supabase-js uses for the session.
function storageKey() {
  try {
    const host = new URL(supabaseUrl).hostname;
    const ref = host.split('.')[0];
    return `sb-${ref}-auth-token`;
  } catch {
    return null;
  }
}

function readSession() {
  const key = storageKey();
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.access_token) return parsed;
    return null;
  } catch {
    return null;
  }
}

function setupStatusBar() {
  if (typeof StatusBar.setStyle === 'function') {
    StatusBar.setStyle({ style: 'LIGHT' }).catch(() => {});
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
  }
}

function setupBackButton() {
  if (typeof App.addListener !== 'function') return;
  App.addListener('backButton', () => {
    if (window.history && window.history.length > 1) {
      window.history.back();
    } else if (typeof App.exitApp === 'function') {
      App.exitApp();
    }
  });
}

function setupPushRegistration() {
  if (!isNative() || !window.Capacitor?.Plugins?.PushNotifications) return;

  // Tiny supabase client used ONLY by the bridge to write push_tokens.
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const syncToken = async (token) => {
    const session = readSession();
    if (!session || !session.access_token) {
      console.warn('[bridge] no auth session to bind push token');
      return;
    }
    try {
      // Restore the session so RLS policies (auth.uid()) pass.
      const { error: sessErr } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      if (sessErr) throw sessErr;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('push_tokens').upsert(
        { user_id: user.id, token, platform: 'android' },
        { onConflict: 'token' }
      );
      console.info('[bridge] push token registered for', user.id);
    } catch (err) {
      console.warn('[bridge] token upsert failed:', err?.message || err);
    }
  };

  PushNotifications.requestPermissions()
    .then((perm) => {
      if (perm.receive !== 'granted') return;
      PushNotifications.register();
      PushNotifications.addListener('registration', (reg) => {
        if (reg?.value) syncToken(reg.value);
      });
      PushNotifications.addListener('registrationError', (err) => {
        console.warn('[bridge] FCM registration error:', err);
      });
    })
    .catch((err) => console.warn('[bridge] permission request failed:', err));
}

function setupUpdateBanner() {
  if (!appVersion) return;
  fetch('./version.json?t=' + Date.now())
    .then((r) => (r.ok ? r.json() : null))
    .then((meta) => {
      if (!meta || !meta.downloadUrl || !meta.version) return;
      const installed = String(appVersion || '').trim();
      const latest = String(meta.version || '').trim();
      if (!installed || installed === latest) return;
      showBanner(meta);
    })
    .catch(() => {});
}

function showBanner(meta) {
  if (document.getElementById('eqr-update-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'eqr-update-banner';
  banner.style.cssText = [
    'position: fixed', 'left: 0', 'right: 0', 'bottom: 0',
    'z-index: 2147483647', 'display: flex', 'align-items: center',
    'justify-content: space-between', 'gap: 12px',
    'padding: 12px 16px', 'background: #1565c0', 'color: #fff',
    'font: 600 14px/1.4 Roboto, sans-serif', 'box-shadow: 0 -2px 12px rgba(0,0,0,.25)',
  ].join(';');
  const label = document.createElement('span');
  label.textContent = `Version ${meta.version} available`;
  if (meta.changelog) label.title = meta.changelog;
  const close = document.createElement('button');
  close.textContent = '✕';
  close.style.cssText = 'background:none;border:none;color:#fff;font-size:16px;cursor:pointer;padding:4px;';
  close.addEventListener('click', () => banner.remove());
  const link = document.createElement('a');
  link.textContent = 'Download APK';
  link.href = meta.downloadUrl;
  link.target = '_blank';
  link.style.cssText = 'background:#fff;color:#1565c0;font-weight:700;border-radius:4px;padding:8px 14px;text-decoration:none;';
  banner.append(label, link, close);
  document.body.appendChild(banner);
}

if (isNative() && supabaseUrl && supabaseAnonKey) {
  setupStatusBar();
  setupBackButton();
  setupPushRegistration();
  setupUpdateBanner();
  // Re-check when the web app signs in/out (storage is same-origin).
  setInterval(() => {
    const sess = readSession();
    const had = window.__bridgeHadSession;
    if (!had && sess) window.dispatchEvent(new Event('eqr-bridge-session'));
    window.__bridgeHadSession = Boolean(sess);
  }, 3000);
}
