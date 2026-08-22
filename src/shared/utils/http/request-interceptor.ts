/**
 * @file Axios request interceptor — attaches access token and device headers.
 *
 * Adds a trace ID, device type, association slug, and Bearer token (if available)
 * to every outgoing request.
 */

// import { encryptFields } from '@lib/encryption';
import { TokenStoreManager } from '@stores/token.store';
import type { InternalAxiosRequestConfig } from 'axios';

/**
 * Creates the request interceptor that attaches the access token and device headers
 * to every outgoing request.
 *
 * @returns The request interceptor function.
 */
export const createRequestInterceptor = () => {
  return async (config: InternalAxiosRequestConfig) => {
    const accessToken = await TokenStoreManager.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `accessToken ${accessToken}`;
    }

    // if (config.data) {
    //   config.data = {
    //     ...encryptFields(config.data),
    //     version: '24',
    //   };
    // }

    return config;
  };
};
