import { useAuthStore } from '@stores/auth.store';
import { usePathname, useRouter, useLocalSearchParams, Href } from 'expo-router';
import React, { useEffect } from 'react';
import { LoadingScreen } from '@components/screens/loading-screen';
import { isGuestOnlyRoute, isPublicRoute, isProtectedRoute } from '@utils/constants/auth';
import { PAGE_ROUTES } from '@utils/constants/routes';

type Props = {
  children: React.ReactNode;
};

/**
 * Authentication redirect guard with three-tier access control.
 *
 * Handles:
 * 1. Waiting for auth hydration/loading to complete.
 * 2. Guest-only routes: redirect authenticated users away (login, register).
 * 3. Public routes: accessible by both authenticated and non-authenticated users.
 * 4. Protected routes: redirect non-authenticated users to auth page.
 *
 * Route Categories:
 * - Guest-Only: /auth, /auth/register, /auth/reg-instruction
 * - Public: /user-manual, /privacy-policy, /contact-us, /about
 * - Protected: Everything else (requires authentication)
 */
export const AuthRedirect = ({ children }: Props) => {
  const { isAuthLoading: isLoading, isSignedIn } = useAuthStore();

  const pathName = usePathname();
  const router = useRouter();
  const params = useLocalSearchParams();

  const redirectTo = params.redirect as Href;
  const redirectHref = (redirectTo || PAGE_ROUTES.HOME) as Href;

  const onGuestOnlyPage = isGuestOnlyRoute(pathName);
  const onPublicPage = isPublicRoute(pathName);
  const onProtectedPage = isProtectedRoute(pathName);

  useEffect(() => {
    if (isLoading) return;

    // 1. Authenticated user on guest-only page -> redirect to home (or redirectTo)
    if (isSignedIn && onGuestOnlyPage) {
      router.replace(redirectHref);
      return;
    }

    // 2. Non-authenticated user on protected page -> redirect to auth
    if (!isSignedIn && onProtectedPage) {
      router.replace(PAGE_ROUTES.AUTH.HOME);
      return;
    }

    // 3. Public pages and authenticated users on protected pages -> allow access (no redirect)
  }, [
    isLoading,
    isSignedIn,
    onGuestOnlyPage,
    onPublicPage,
    onProtectedPage,
    pathName,
    redirectTo,
    router,
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
