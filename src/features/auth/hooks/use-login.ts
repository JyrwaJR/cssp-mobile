import { encryptFields } from '@lib/encryption';
import { LoginT } from '@sharedTypes/auth';
import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/http';
import { LoginInput } from '../validators';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const encData = encryptFields<LoginInput>(data);

      const payload = new URLSearchParams({
        username: encData.username,
        password: encData.password,
        version: '24',
      });

      console.log('payload:', payload.toString());

      return await http.post<LoginT>(ENDPOINTS.AUTH.LOGIN, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });
    },
    onError: (error) => {
      console.log('useLogin Error', error);
    },
    onSuccess: (data) => {
      console.log('useLogin Success', data);
    },
  });
}
