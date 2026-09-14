import { useMutation } from '@tanstack/react-query';
import { http } from '@utils/http';
import { LoginInput } from '../validators';
import { encryptText } from '@lib/encryption';
import { ENDPOINTS } from '@utils/constants';
import { TokenStoreManager } from '@stores/token.store';
import { logger } from '@utils/logger';

export function useDatLogin() {
  return useMutation({
    mutationFn: (data: LoginInput) => {
      const ecryptedData = encryptText(JSON.stringify(data));
      return http.post<{ token: string }>(ENDPOINTS.AUTH.DAT_LOGIN, { payload: ecryptedData });
    },
    onSuccess: async (data) => {
      if (__DEV__) {
        logger.info('Login Res with Second Login', data.success);
      }
      if (data.data?.token) {
        await TokenStoreManager.addDatAccessToken(data?.data?.token);
      }
      return data;
    },
  });
}
