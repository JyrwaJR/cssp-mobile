import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants';
import { http } from '@utils/http';
import type { VerificationResponseT } from '../types';
import { useAuthStore } from '@stores/auth.store';

interface VerificationPayload {
  image_1: string;
  image_2: string;
}

/**
 * Submits face verification photos to `POST /api/verification/`.
 *
 * Sends base64-encoded face images as a plain object (auto-encrypted by
 * the request interceptor). On success with `self_ver_code !== '03'` and
 * stored `approval !== '00'`, updates `approval` to `'01'` in the auth
 * store to mark the photo as submitted.
 *
 * @returns TanStack Query mutation with `VerificationResponseT` result.
 */
export function useSubmitVerification() {
  // TODO: change and saperate this
  const { setUser, user } = useAuthStore();
  return useMutation({
    mutationFn: async (payload: VerificationPayload) =>
      http.post<VerificationResponseT>(ENDPOINTS.VERIFICATION.VERIFICATION, payload),

    onSuccess: async ({ data }) => {
      if (!data) return;
      if (data.self_ver_code === '03') return;
      const regStatus = user?.approval;
      if (regStatus === '00') return;
      setUser({
        approval: '01',
        username: user?.username || '',
        uid: user?.uid || '',
        name: user?.name || '',
        has_dlc: user?.has_dlc || '',
        ppo_no: user?.username || '',
      });
    },
  });
}
