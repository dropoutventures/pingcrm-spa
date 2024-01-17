import { CapacitorConfig } from '@capacitor/cli';
import { loadEnv } from 'vite';

process.env = {...process.env, ...loadEnv(process.env.NODE_ENV, process.cwd())};

let config: CapacitorConfig = {
  appId: process.env.VITE_APP_URL.split('.').reverse().join('.'),
  appName: process.env.VITE_APP_NAME,
  webDir: "dist",
  server: {
    androidScheme: "https",
    hostname: process.env.VITE_APP_URL,
  },
  ios: {
    backgroundColor: "#ffffff",
    allowsLinkPreview: false,
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    }
  }
};

export default config;


