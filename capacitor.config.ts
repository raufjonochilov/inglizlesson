import type { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.LINGUAPULSE_SERVER_URL;
if (!serverUrl || new URL(serverUrl).protocol !== 'https:') {
  throw new Error('Android uchun LINGUAPULSE_SERVER_URL HTTPS veb-server manzilini kiriting.');
}

const config: CapacitorConfig = {
  appId: 'com.linguapulse.app',
  appName: 'LinguaPulse AI',
  webDir: 'out',
  server: {
    url: serverUrl,
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
