import { useAuthStore } from '@stores/auth.store';
import { usePathname, useRouter, useLocalSearchParams, Href } from 'expo-router';
import React, { useEffect } from 'react';
import { LoadingScreen } from '@components/screens/loading-screen';
import { PUBLIC_ROUTES } from '@utils/constants/auth';
import { logger } from '@utils/logger';
import { PAGE_ROUTES } from '@utils/constants/routes';

type Props = {
  children: React.ReactNode;
};

/**
 * Authentication redirect guard.
 *
 * Handles:
 * 1. Waiting for auth hydration/loading to complete.
 * 2. Redirecting authenticated users away from public routes.
 * 3. Redirecting unauthenticated users to the auth page.
 *
 * Role-based access control is intentionally handled elsewhere.
 */
export const AuthRedirect = ({ children }: Props) => {
  const { isAuthLoading: isLoading, isSignedIn } = useAuthStore();

  const pathName = usePathname();
  const router = useRouter();
  const params = useLocalSearchParams();

  const redirectTo = params.redirect as string | undefined;

  const isOnPublicPage = PUBLIC_ROUTES.includes(pathName as Href);

  useEffect(() => {
    if (isLoading) return;

    // 1. Signed-in user trying to access a public page.
    if (isSignedIn && isOnPublicPage) {
      router.replace((redirectTo as Href) || PAGE_ROUTES.HOME);

      return;
    }

    // 2. Unauthenticated user trying to access a protected page.
    if (!isSignedIn && !isOnPublicPage) {
      router.replace(PAGE_ROUTES.AUTH.HOME);
      return;
    }
  }, [isLoading, isSignedIn, isOnPublicPage, pathName, redirectTo, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
