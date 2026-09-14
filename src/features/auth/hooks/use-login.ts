import { LoginT } from '@sharedTypes/auth';
import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/http';
import { LoginInput } from '../validators';
import { useAuthStore } from '@stores/auth.store';
import { useDatLogin } from './use-dat-login';
import { logger } from '@utils/logger';

const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

export function useLogin() {
  const { setUser } = useAuthStore();
  const { mutate } = useDatLogin();
  return useMutation({
    mutationFn: async (data: LoginInput) =>
      http.post<LoginT>(ENDPOINTS.AUTH.LOGIN, data, { headers }),
    onSuccess: ({ success, data }, { username, password }) => {
      if (!success) return;
      if (!data) return;
      setUser({
        approval: data.approval,
        username: data.username,
        uid: data.uid,
        name: data.name,
        has_dlc: data.has_dlc,
        ppo_no: username,
      });
      if (__DEV__) {
        logger.info('Login for the second time');
      }
      mutate({ password, username });
    },
  });
}
