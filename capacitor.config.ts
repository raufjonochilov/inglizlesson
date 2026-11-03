import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.linguapulse.app',
  appName: 'LinguaPulse AI',
  webDir: 'out',
  server: {
    // Для разработки: подключаемся к локальному серверу
    // Для продакшена: замените на ваш сервер (например, https://linguapulse.vercel.app)
    url: process.env.LINGUAPULSE_SERVER_URL || 'http://10.0.2.2:3001',
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;
