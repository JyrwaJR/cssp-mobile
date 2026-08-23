import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { UserT } from '../types/auth';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '@utils/logger';
import { http } from '@utils/http';
import { ENDPOINTS } from '@utils/constants';

type AuthStore = {
  user?: UserT | null;
  isSignedIn: boolean;
  isAuthLoading: boolean;

  fetchUser: () => Promise<void>;
  refresh: () => void;
  reset: () => void;
  logout: () => Promise<void>;
  _hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isSignedIn: false,
      isAuthLoading: true,

      fetchUser: async (keepStaleOnError?: boolean) => {
        logger.info('AuthStore: fetchUser called', { keepStaleOnError });

        const accessToken = await TokenStoreManager.getAccessToken();

        if (accessToken) {
          try {
            const res = await http.post<UserT>(ENDPOINTS.AUTH.CURRENT_USER);

            if (res.success && res.data) {
              set({
                user: res.data,
                isSignedIn: true,
                isAuthLoading: false,
              });
            } else {
              logger.warn('AuthStore: fetchUser returned no data', {
                message: res.message,
                success: res.success,
              });
              get().reset();
            }
          } catch (error) {
            logger.error('AuthStore: fetchUser failed', error);
            if (!keepStaleOnError) {
              get().reset();
            }
          }
        } else {
          logger.warn('AuthStore: fetchUser skipped — emp_cd is empty', !!accessToken);
        }
      },

      refresh: () => {
        get().fetchUser();
      },

      reset: () => {
        set({ user: null, isSignedIn: false });
      },

      logout: async () => {
        try {
          const accessToken = await TokenStoreManager.getAccessToken();
          if (accessToken) {
            await http.post(ENDPOINTS.AUTH.LOGOUT);
          }
        } catch (error) {
          logger.error('AuthStore: logout API call failed', error);
        }

        await TokenStoreManager.removeTokens();
        get().reset();

        try {
          const { queryClient } = await import('@utils/react-query');
          queryClient.clear();
        } catch {}
      },

      _hydrate: async () => {
        logger.info('AuthStore: _hydrate started');
        const state = get();
        logger.info('AuthStore: current store state', {
          user: !!state.user,
          isSignedIn: state.isSignedIn,
        });
        try {
          const accessToken = await TokenStoreManager.getAccessToken();
          logger.info('AuthStore: access token found', { hasToken: !!accessToken });
          if (accessToken) {
            await get().fetchUser();
          } else {
            get().reset();
          }
        } catch (error) {
          logger.error('AuthStore: _hydrate failed', error);
          get().reset();
        } finally {
          logger.info('AuthStore: _hydrate complete, setting isAuthLoading=false');
          set({ isAuthLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (key) => {
          const value = await SecureStore.getItemAsync(key);
          logger.info('AuthStore: persist getItem', { key, hasValue: !!value });
          return value;
        },
        setItem: async (key, value) => {
          logger.info('AuthStore: persist setItem', { key, size: value?.length });
          return SecureStore.setItemAsync(key, value);
        },
        removeItem: async (key) => {
          logger.info('AuthStore: persist removeItem', { key });
          return SecureStore.deleteItemAsync(key);
        },
      })),

      partialize: (state) => {
        const partial = {
          user: state.user,
          isSignedIn: state.isSignedIn,
          isAuthLoading: false,
        };
        logger.info('AuthStore: persist partialize', {
          hasUser: !!state.user,
          isSignedIn: state.isSignedIn,
        });
        return partial;
      },
    }
  )
);
