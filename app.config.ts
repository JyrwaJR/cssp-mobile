import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'cssp-mobile',
  slug: 'cssp-mobile',
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
  },

  android: {
    package: 'com.jyrwajr.csspmobile',
    adaptiveIcon: {
      foregroundImage: './src/shared/assets/images/logo.jpg',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
