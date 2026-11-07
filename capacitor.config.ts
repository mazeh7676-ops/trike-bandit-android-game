import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trike.rustler',
  appName: 'سه‌چرخه شوتی',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0f172a',
    allowMixedContent: true,
  },
};

export default config;
