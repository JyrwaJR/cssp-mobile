import { LoginT } from '@sharedTypes/auth';
import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/http';

type LoginFormValue = {
  username: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginFormValue) => {
      const body = new URLSearchParams({
        ...data,
        version: '24',
      });
      return await http.post<LoginT>(ENDPOINTS.AUTH.LOGIN, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });
    },
  });
}
