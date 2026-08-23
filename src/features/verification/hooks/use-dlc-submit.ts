import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants';
import { http } from '@utils/http';
import type { VerificationResponseT } from '../types';
import { Platform } from 'react-native';
import * as Application from 'expo-application';

interface DLCPayload {
  selfVerNec: 'Yes' | 'No';
  selfVerNmc: 'Yes' | 'No' | '';
  self_ver_code: string;
}

/**
 * Submits the Digital Life Certificate (DLC) self-declaration to `POST /api/lc/`.
 *
 * Device metadata (device name, device ID) is sent as plain strings;
 * the request interceptor auto-encrypts all plain-object fields via Fernet.
 * `ver_mode_code` is fixed at `'01'`; `place` is always empty string.
 *
 * @returns TanStack Query mutation with `VerificationResponseT` result.
 */
export function useSubmitDLC() {
  return useMutation({
    mutationFn: async (payload: DLCPayload) => {
      const deviceName = Application.applicationName ?? 'Unknown';
      const deviceId =
        Platform.OS === 'ios'
          ? (await Application.getIosIdForVendorAsync()) ?? 'unknown'
          : (await Application.getAndroidId()) ?? 'unknown';

      const response = await http.post<VerificationResponseT>(ENDPOINTS.DLC.CREATE, {
        selfVerNec: payload.selfVerNec,
        selfVerNmc: payload.selfVerNmc,
        device: deviceName,
        device_id: deviceId,
        ver_mode_code: '01',
        self_ver_code: payload.self_ver_code,
        place: '',
      });

      if (!response.success) {
        throw new Error(response.message || 'DLC submission failed');
      }

      return response.data!;
    },
  });
}
