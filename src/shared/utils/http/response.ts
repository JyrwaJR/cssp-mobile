/**
 * @file Axios response and error handlers.
 *
 * Contains the two helper functions used by the HTTP client to transform
 * raw Axios responses and errors into the standardised {@link ApiResponse} shape.
 */

import { TokenStoreManager } from '@stores/token.store';
import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from '@sharedTypes/api';
import { logger } from '@utils/logger';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { LoginT } from '@sharedTypes/auth';

/** Shape of error bodies the backend may return. */
type BackendErrorBody = {
  message?: string;
  error?: string | Record<string, unknown>;
  errors?: Record<string, unknown>;
  msg?: string;
};

/** Fallback shown when the backend provides no usable message. */
const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';
/** Shown when the request was sent but no response arrived. */
const NETWORK_ERROR_MESSAGE = 'Please check your internet connection.';

/**
 * Extracts the most specific human-readable message from a backend body.
 *
 * Handles string bodies, `message`, `msg`, and string-valued `error` keys.
 * Returns `undefined` when nothing usable exists so callers apply defaults.
 */
const extractBackendMessage = (data: unknown): string | undefined => {
  if (typeof data === 'string') {
    return data.trim() || undefined;
  }
  if (!data || typeof data !== 'object') {
    return undefined;
  }

  const body = data as BackendErrorBody;
  return (
    body.message ??
    body.msg ??
    (typeof body.error === 'string' && body.error.trim() ? body.error : undefined) ??
    undefined
  );
};

/**
 * Builds the standard failure-payload fields from a backend body.
 *
 * Always yields a `message`; preserves `errors` (validation map) and
 * object-shaped `error` details when present.
 */
const buildErrorFields = (
  data: unknown
): Pick<ApiResponse<unknown>, 'message' | 'error' | 'errors'> => {
  if (data && typeof data === 'object') {
    const body = data as BackendErrorBody;
    return {
      message: extractBackendMessage(body) ?? DEFAULT_ERROR_MESSAGE,
      ...(body.errors && { errors: body.errors }),
      ...(body.error && typeof body.error === 'object' && { error: body.error }),
    };
  }
  return { message: extractBackendMessage(data) ?? DEFAULT_ERROR_MESSAGE };
};

/**
 * Transforms an unknown error into a standard error {@link ApiResponse}.
 *
 * Handles three error categories:
 * - **AxiosError with response** — includes the HTTP `status` and extracts
 *   the server-provided message/details.
 * - **AxiosError without response (network)** — connection-failure message;
 *   `status` is omitted since no HTTP exchange occurred.
 * - **Generic/unknown errors** — uses the error's own message when available.
 *
 * @param error - The caught error (Axios or otherwise).
 * @returns A standardised error response with `success: false`.
 */
export const handleAxiosError = <T>(error: unknown): ApiResponse<T> => {
  if (error instanceof AxiosError) {
    // Server responded with an error status
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        ...buildErrorFields(error.response.data),
      };
    }

    // Request was made but no response was received
    if (error.request) {
      return { success: false, message: NETWORK_ERROR_MESSAGE };
    }

    // Something went wrong while setting up the request
    return {
      success: false,
      message: error.message || DEFAULT_ERROR_MESSAGE,
    };
  }

  // Normal JavaScript Error
  if (error instanceof Error) {
    return { success: false, message: error.message || DEFAULT_ERROR_MESSAGE };
  }

  // Unknown error type
  return { success: false, message: DEFAULT_ERROR_MESSAGE };
};

/** Fallback message when a successful body carries no usable message. */
const DEFAULT_SUCCESS_MESSAGE = 'Success';

/**
 * Transforms a successful Axios response into a standard {@link ApiResponse}.
 *
 * Marks the response as successful for any 2xx status (200–299). Non-2xx
 * statuses also reach this handler for auth endpoints, because the response
 * interceptor resolves those error responses directly to callers — they are
 * remapped here with the same extraction logic as {@link handleAxiosError}.
 *
 * @param response - The Axios response object.
 * @returns A standardised response with `status` always populated.
 */
export const handleResponse = <T>(response: AxiosResponse<T>): ApiResponse<T> => {
  const { status, data } = response;
  const isSuccess = status >= 200 && status < 300;

  if (isSuccess) {
    return {
      success: true,
      status,
      message: extractBackendMessage(data) ?? DEFAULT_SUCCESS_MESSAGE,
      data,
    };
  }

  // Non-2xx resolved by the auth-path branch of the response interceptor.
  return {
    success: false,
    status,
    ...buildErrorFields(data),
  };
};

interface LoginResponseT extends LoginT {
  renew_token: string;
  token: string;
}

export const handleLoginResponse = async (response: AxiosResponse) => {
  const requestUrl = response.config.url || '';

  // Safely check if the request path matches the login endpoint, ignoring query parameters
  const isLoginEndpoint = requestUrl.split('?')[0].endsWith(ENDPOINTS.AUTH.LOGIN);

  // Axios only passes 2xx status codes to this handler by default
  if (isLoginEndpoint && response.data && response.status === 200) {
    const data = response.data as LoginResponseT;

    try {
      if (data.token) {
        logger.info('Setting Token');
        await TokenStoreManager.addAccessToken(data.token);
        logger.info('Token Set');
      }

      if (data.renew_token) {
        logger.info('Setting Refresh Token');
        await TokenStoreManager.addRefreshToken(data.renew_token);
        logger.info('Refresh Token Set');
      }
    } catch (error) {
      logger.error('Failed to save tokens to store', error);
      return Promise.reject(error);
    }

    // Strip tokens from the response payload returned to callers
    const { token, renew_token, ...userData } = data;
    response.data = userData;
  }

  return response;
};

export const handleRefreshTokenResponse = async (response: AxiosResponse) => {
  // TODO: handle renew token response
  if (response.status === 200 && response.config.url?.endsWith('/validate_token')) {
    // TODO
  }
  return response;
};
