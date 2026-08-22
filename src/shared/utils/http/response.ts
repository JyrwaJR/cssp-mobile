/**
 * @file Axios response and error handlers.
 *
 * Contains the two helper functions used by the HTTP client to transform
 * raw Axios responses and errors into the standardised {@link ApiResponse} shape.
 */

import { TokenStoreManager } from '@stores/token.store';
import { AxiosError, AxiosResponse } from 'axios';

import { ApiResponse } from '@sharedTypes/api';
import { LoginT } from '@sharedTypes/auth';
import { logger } from '@utils/logger';
import { ENDPOINTS } from '@utils/constants/endpoints';

/**
 * Transforms an unknown error into a standard error {@link ApiResponse}.
 *
 * Handles three error categories:
 * - **AxiosError with response** — extracts server-provided message and details.
 * - **AxiosError without response (network)** — provides a connection-failure message.
 * - **Generic Error** — uses the error's own message.
 *
 * @param error - The caught error (Axios or otherwise).
 * @returns A standardised error response with `success: false`.
 */

type BackendError = {
  message?: string;
  error?: string | Record<string, unknown>;
  errors?: Record<string, unknown>;
  msg?: string;
};

export const handleAxiosError = <T>(error: unknown): ApiResponse<T> => {
  const defaultMessage = 'Something went wrong. Please try again.';

  // Axios error
  if (error instanceof AxiosError) {
    // Server responded with an error status
    if (error.response) {
      const data = error.response.data as BackendError | string | null;

      // Backend returned a string directly
      if (typeof data === 'string') {
        return {
          success: false,
          message: data,
        };
      }

      if (data && typeof data === 'object') {
        const message =
          data.message ??
          data.msg ??
          (typeof data.error === 'string' ? data.error : undefined) ??
          defaultMessage;

        return {
          success: false,
          message,
          // Include backend validation/details if your ApiResponse supports it
          ...(data.errors && { errors: data.errors }),
          ...(data.error &&
            typeof data.error === 'object' && {
              error: data.error,
            }),
        };
      }

      return {
        success: false,
        message: defaultMessage,
      };
    }

    // Request was made but no response was received
    if (error.request) {
      return {
        success: false,
        message: 'Please check your internet connection.',
      };
    }

    // Something went wrong while creating the request
    return {
      success: false,
      message: error.message || defaultMessage,
    };
  }

  // Normal JavaScript Error
  if (error instanceof Error) {
    return {
      success: false,
      message: error.message || defaultMessage,
    };
  }

  // Unknown error type
  return {
    success: false,
    message: defaultMessage,
  };
};
/**
 * Transforms a successful Axios response into a standard {@link ApiResponse}.
 *
 * Marks the response as successful when the HTTP status is `200` or `201`.
 *
 * @param response - The Axios response object.
 * @returns A standardised success response.
 */
export const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> => {
  const {
    status,
    data: { data, message },
  } = response;
  return {
    success: status === 200 || status === 201,
    message,
    data,
  };
};

export const handleLoginResponse = async (response: AxiosResponse) => {
  if (response.status === 200 && response.config.url?.endsWith(ENDPOINTS.AUTH.LOGIN)) {
    const data = response.data as LoginT;
    if (data) {
      const accessToken = data.token;
      const refreshToken = data.renew_token;
      if (accessToken) {
        logger.info('Setting Token');
        await TokenStoreManager.addAccessToken(accessToken);
        logger.info('Token Set');
      }
      if (refreshToken) {
        logger.info('Setting Refresh Token');
        await TokenStoreManager.addRefreshToken(refreshToken);
        logger.info('Refresh Token Set');
      }
    }
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
