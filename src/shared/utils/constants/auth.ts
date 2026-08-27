import { Href } from 'expo-router';

/**
 * Configuration for a role-protected route.
 */
export type RouteConfigT = {
  /** The route path pattern (supports wildcards like `/(admin)/*`). */
  url: string;
  /** Whether the route requires authentication. */
  needAuth: boolean;
  /** Allowed user roles for this route. */
  redirect?: string;
};

/**
 * Routes accessible without authentication.
 */
export const PUBLIC_ROUTES: Href[] = [
  '/auth',
  '/auth/register',
  '/auth/reg-instruction',
  '/user-manual',
  '/privacy-policy',
];
