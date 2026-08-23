import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'cssp-mobile',
  slug: 'cssp',
  version: '1.0.0',

  scheme: 'cssp-mobile',

  platforms: ['ios', 'android'],

  orientation: 'portrait',

  userInterfaceStyle: 'light',

  icon: './src/shared/assets/images/logo.jpg',

  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './src/shared/assets/images/logo.jpg',
        backgroundColor: '#ffffff',
        dark: {
          image: './src/shared/assets/images/logo.jpg',
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-secure-store',
    'expo-font',
    'expo-status-bar',
  ],

  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },

  assetBundlePatterns: ['**/*'],

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.jyrwajr.csspmobile',
    infoPlist: {
      NSCameraUsageDescription: 'CSSP Mobile needs access to your camera for photo verification.',
    },
  },

  android: {
    package: 'com.jyrwajr.csspmobile',
    permissions: ['android.permission.CAMERA'],
    adaptiveIcon: {
      foregroundImage: './src/shared/assets/images/logo.jpg',
      backgroundColor: '#ffffff',
    },
  },
  extra: {
    eas: {
      projectId: '9ac6a35c-06b5-445c-8227-37951817b496',
    },
  },
};

export default config;
