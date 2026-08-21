import { LoginT } from '@sharedTypes/auth';
import { useMutation } from '@tanstack/react-query';
import { http } from '@utils/http';

type LoginFormValue = {
  username: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginFormValue) =>
      http.post<LoginT>('/login', new URLSearchParams(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
  });
}
