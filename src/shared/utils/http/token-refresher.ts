/**
 * @file Token refresh logic and failed-request queue.
 *
 * Manages the state of in-flight token refresh attempts and queues
 * requests that arrive while a refresh is in progress so they can be
 * retried once the new token is available.
 */

import type { QueueItem } from '@sharedTypes/api';
import { tokenRefreshClient } from './token-refresh-client';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '@utils/logger';

/** Flag indicating if a token refresh request is currently in flight. */
export let isRefreshing = false;

/** List of requests waiting for the token refresh to complete. */
export const failedQueue: QueueItem[] = [];

/** @internal */
export const setRefreshing = (value: boolean) => {
  isRefreshing = value;
};

/**
 * Processes the failed request queue after a refresh attempt.
 *
 * @param error - If provided, all queued requests are rejected with this error.
 * @param token - If provided, all queued requests are resolved with this new token.
 */
export const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue.length = 0;
};

type RefreshResponse = {
  token: string;
};

/**
 * Performs a token refresh request using the stored refresh token.
 *
 * @throws If the refresh request fails.
 * @returns The new access token.
 */
export const refreshToken = async (): Promise<string> => {
  const refreshTokenValue = await TokenStoreManager.getRefreshToken();

  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }

  const response = await tokenRefreshClient.post<{ data?: RefreshResponse }>(
    ENDPOINTS.AUTH.VALIDATE_TOKEN,
    new URLSearchParams({ token: refreshTokenValue }),
    {
      headers: {
        Authorization: `renewToken ${refreshTokenValue}`,
      },
    }
  );

  const newAccessToken = response.data.data?.token ?? '';

  if (newAccessToken) {
    logger.info('Token Refreshed');
    await TokenStoreManager.addAccessToken(newAccessToken);
  }

  return newAccessToken;
};