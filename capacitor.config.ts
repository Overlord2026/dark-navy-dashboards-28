import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.00a954941379485c9fca9a2135238b56',
  appName: 'dark-navy-dashboards',
  webDir: 'dist',
  server: {
    url: 'https://00a95494-1379-485c-9fca-9a2135238b56.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1B1B32'
    }
  }
};

export default config;