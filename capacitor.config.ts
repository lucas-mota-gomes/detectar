import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.detectar.app',
  appName: 'Detectar',
  webDir: 'dist/detectar-angular',
  android: {
    
  },
  bundledWebRuntime: false,
  "server": {
    "cleartext": true
  }
};

export default config;
