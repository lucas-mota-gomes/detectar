import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.detectar.app',
  appName: 'detectar',
  webDir: 'dist/detectar-angular',
  bundledWebRuntime: false,
  "server": {
    "cleartext": true
  }
};

export default config;
