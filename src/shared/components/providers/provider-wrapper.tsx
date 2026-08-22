import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

// Internal Providers
import { AuthInitializer } from './auth-provider';
import { NotificationProvider } from './notification-provider';
import { TQueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
// Shared Components & Redirects
import { AuthRedirect } from '@components/common/auth-redirect';
import { UpdateModal } from './update-modal';
import { GlobalErrorBoundary } from './global-error-boundary';

type Props = {
  children: React.ReactNode;
};

/**
 * Global Provider Wrapper
 *
 * Consolidates all application-wide providers into a single optimized tree.
 * Hierarchy follows a dependency-first approach:
 * 1. Low-level Infrastructure (Gestures, SafeArea, SSL, Updates)
 * 2. Data & State Management (Query, Theme)
 * 3. Domain Contexts (Auth, Notifications)
 * 4. Navigation & Security Gates (LocalAuth, AuthRedirect)
 */
export const ProviderWrapper = ({ children }: Props) => {
  return (
    <GlobalErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider className="flex-1">
          <TQueryProvider>
            <QueryErrorResetBoundary>
              <ThemeProvider>
                <AuthInitializer>
                  <NotificationProvider>
                    <AuthRedirect>
                      <StatusBar style="auto" animated />
                      {children}
                      <UpdateModal />
                    </AuthRedirect>
                  </NotificationProvider>
                </AuthInitializer>
              </ThemeProvider>
            </QueryErrorResetBoundary>
          </TQueryProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GlobalErrorBoundary>
  );
};
