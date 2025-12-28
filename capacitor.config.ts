import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.questjourney',
  appName: 'Quest Journey',
  webDir: 'dist',
  server: {
    url: 'https://15705278-5d23-4633-8825-f3700e769e0d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHealth: {
      // HealthKit permissions for iOS
      readPermissions: [
        'steps',
        'distance',
        'calories',
        'activity',
        'heart_rate'
      ],
      writePermissions: []
    }
  }
};

export default config;
