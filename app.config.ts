import type { ExpoConfig } from 'expo/config';

/**
 * Expo application configuration (app.config.ts).
 *
 * Builds the mobile app manifest for ios + android. The iOS `bundleIdentifier`
 * and Android `package` are computed from the `APP_VARIANT` environment variable,
 * allowing development, preview, and production builds to be installed side by
 * side on the same device using distinct bundle IDs.
 *
 * @package cssp-mobile
 * @see eas.json  (injects APP_VARIANT per build profile)
 */

const bundleIdentifier = 'com.jyrwajr.csspmobile';
const androidPackage = 'com.jyrwajr.csspmobile';

const variant = process.env.APP_VARIANT;

/**
 * Derives the platform bundle identifier for the active build variant.
 *
 * Appends a `.dev` or `.preview` suffix to the base bundle ID when
 * `process.env.APP_VARIANT` is set accordingly. Returns the base ID unchanged
 * when the variant is unset or unknown (production).
 *
 * @param base - The base bundle identifier/package name (e.g. `com.jyrwajr.csspmobile`).
 * @returns The variant-suffixed ID: `<base>.dev`, `<base>.preview`, or the input `base`.
 * @see APP_VARIANT
 */
function getBundleId(base: string): string {
  if (variant === 'development') return `${base}.dev`;
  if (variant === 'preview') return `${base}.preview`;
  return base;
}

const config: ExpoConfig = {
  name: 'PensionApp',
  slug: 'cssp',
  version: '3.0.0',

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
  ],

  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },

  assetBundlePatterns: ['src/shared/assets/**/*'],

  ios: {
    supportsTablet: true,

    bundleIdentifier: getBundleId(bundleIdentifier),

    infoPlist: {
      NSCameraUsageDescription: 'CSSP Mobile needs access to your camera for photo verification.',
    },
  },

  android: {
    package: getBundleId(androidPackage),
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

/**
 * Expo configuration for the cssp-mobile application.
 *
 * Applies platform-specific bundle identifiers and Android/iOS packages derived
 * from the {@link getBundleId} variant logic, plus the app icon, splash screen,
 * camera permission copy, and EAS project linkage.
 */
export default config;
