import { RoleT } from '@sharedTypes/auth';
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
  role: RoleT[];
  /** Optional redirect path when access is denied. */
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
