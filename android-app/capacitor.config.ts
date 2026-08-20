import { defineConfig } from '@capacitor/cli';

export default defineConfig({
  appId: 'com.thantz.earthquakerecovery',
  appName: 'Earthquake & Recovery',
  webDir: 'web',
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
  },
  server: {
    cleartext: true,
  },
});
