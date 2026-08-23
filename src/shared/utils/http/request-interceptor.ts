/**
 * @file Axios request interceptor — attaches access token and device headers.
 *
 * Adds a trace ID, device type, association slug, and Bearer token (if available)
 * to every outgoing request.
 */

// import { encryptFields } from '@lib/encryption';
import { encryptFields } from '@lib/encryption';
import { TokenStoreManager } from '@stores/token.store';
import type { InternalAxiosRequestConfig } from 'axios';

/**
 * Creates the request interceptor that attaches the access token and device headers
 * to every outgoing request.
 *
 * Body handling: only plain-object bodies are auto-encrypted and stamped with
 * `version`. Pre-serialized bodies (`string`, `URLSearchParams`, `FormData`) are
 * passed through untouched so callers can control their exact wire format
 * (e.g. `application/x-www-form-urlencoded` login payloads) and to prevent
 * double-encrypting values that are already encrypted.
 *
 * @returns The request interceptor function.
 */
export const createRequestInterceptor = () => {
  return async (config: InternalAxiosRequestConfig) => {
    const accessToken = await TokenStoreManager.getAccessToken();

    console.log('Request.ts', accessToken);
    if (accessToken) {
      config.headers.Authorization = `accessToken ${accessToken}`;
    }

    config.data = {
      ...encryptFields(config.data),
      version: '24',
    };

    return config;
  };
};
