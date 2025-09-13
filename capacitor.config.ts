import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fahuapp.mapa',
  appName: 'mapa-fahu',
  webDir: 'build',
  server: {
    cleartext: true,
    androidScheme: "http",
    allowNavigation: ["154.38.176.78"]
  }
};

export default config;
