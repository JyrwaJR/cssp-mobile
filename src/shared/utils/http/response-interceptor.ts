/**
 * @file Axios response interceptor — handles 401 errors with token refresh.
 *
 * On a 401 response, the interceptor attempts to refresh the access token
 * transparently and retry the original request. Auth-path errors bypass the
 * refresh flow and return directly to the caller.
 */

import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { isAuthPath } from './constants';
import { triggerSessionExpired } from './session-expired-handler';
import {
  failedQueue,
  isRefreshing,
  processQueue,
  refreshToken,
  setRefreshing,
} from './token-refresher';
import { TokenStoreManager } from '@stores/token.store';
import { handleLoginResponse, handleRefreshTokenResponse } from './response';

/**
 * Creates the response interceptor that handles 401 errors by attempting
 * to refresh the access token and retrying the failed request.
 *
 * Auth-path errors are returned directly to the caller without triggering
 * the refresh flow.
 *
 * @param apiClient - The Axios instance used to retry failed requests.
 * @returns A pair of [onFulfilled, onRejected] handlers for `axios.interceptors.response.use()`.
 */

export const createResponseInterceptor = (apiClient: AxiosInstance) => {
  return [
    async (response: AxiosResponse) => {
      await handleLoginResponse(response);
      await handleRefreshTokenResponse(response);
      if (__DEV__) {
        console.log('response interceptor', {
          url: response.config.url,
          data: response.data,
        });
      }
      return response;
    },

    async (error: AxiosError) => {
      if (__DEV__) {
        console.log('response interceptor', {
          url: error.config?.url,
          error,
        });
      }
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const requestPath = originalRequest.url ?? '';

      if (isAuthPath(requestPath)) {
        if (error.response) return Promise.resolve(error.response);
        return Promise.reject(error);
      }

      const refreshResponseStatus =
        error.response?.status === 401 || error.response?.status === 202;

      if (refreshResponseStatus && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(apiClient(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        setRefreshing(true);

        try {
          const newToken = await refreshToken();
          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          await TokenStoreManager.removeTokens();

          triggerSessionExpired();

          if (error.response) return Promise.resolve(error.response);
          return Promise.reject(error);
        } finally {
          setRefreshing(false);
        }
      }

      return Promise.reject(error);
    },
  ] as const;
};
