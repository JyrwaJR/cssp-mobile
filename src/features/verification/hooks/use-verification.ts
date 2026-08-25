import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants';
import { http } from '@utils/http';
import type { VerificationResponseT } from '../types';
import { VerificationStoreManager } from '@stores/verification';

interface VerificationPayload {
  image_1: string;
  image_2: string;
}

/**
 * Submits face verification photos to `POST /api/verification/`.
 *
 * Sends base64-encoded face images as a plain object (auto-encrypted by
 * the request interceptor). On success with `self_ver_code !== '03'` and
 * stored `regStatus !== '00'`, updates `regStatus` to `'01'` in SecureStore
 * to mark the photo as submitted.
 *
 * @returns TanStack Query mutation with `VerificationResponseT` result.
 */
export function useSubmitVerification() {
  return useMutation({
    mutationFn: async (payload: VerificationPayload) =>
      http.post<VerificationResponseT>(ENDPOINTS.VERIFICATION.VERIFICATION, payload),

    onSuccess: async ({ data }) => {
      if (data && data.self_ver_code !== '03') {
        const regStatus = await VerificationStoreManager.getRegStatus();
        if (regStatus !== '00') {
          await VerificationStoreManager.updateRegStatus('01');
        }
      }
    },
  });
}
