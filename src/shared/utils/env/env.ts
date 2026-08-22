import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url('EXPO_PUBLIC_API_URL'),
  NODE_ENV: z.enum(['development', 'preview', 'production']).default('development'),

  // App Config
  EXPO_PUBLIC_APP_VERSION: z
    .string('EXPO_PUBLIC_APP_VERSION')
    .regex(/^\d+\.\d+\.\d+$/, 'Must be a valid semantic version, e.g. 1.0.0')
    .default('1.0.0'),
  EXPO_PUBLIC_APP_VARIANT: z.enum(['development', 'preview', 'production']).default('development'),
});

const rawEnv = {
  EXPO_PUBLIC_ENCRYPTION_KEY: process.env.EXPO_PUBLIC_ENCRYPTION_KEY,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION,
  EXPO_PUBLIC_APP_VARIANT: process.env.EXPO_PUBLIC_APP_VARIANT,
  NODE_ENV: process.env.NODE_ENV,
};

const result = envSchema.safeParse(rawEnv);

if (!result.success) {
  console.error('❌ Invalid environment variables:');

  for (const issue of result.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }

  throw new Error('Invalid environment variables');
}

export const env = result.data;
