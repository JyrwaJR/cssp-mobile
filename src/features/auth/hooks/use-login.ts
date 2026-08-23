import { encryptFields } from '@lib/encryption';
import { LoginT } from '@sharedTypes/auth';
import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/http';
import { LoginInput } from '../validators';
import { useAuthStore } from '@stores/auth.store';

export function useLogin() {
  const { refresh } = useAuthStore();
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const encData = encryptFields<LoginInput>(data);

      // Serialize to a urlencoded string before handing off to axios.
      //
      // Passing a string (not the URLSearchParams instance) guarantees no
      // downstream transform can rebuild or re-encrypt the body, so the wire
      // format exactly matches the server's expected form fields.
      const payload = new URLSearchParams({
        username: encData.username,
        password: encData.password,
        version: '24',
      });

      return await http.post<LoginT>(ENDPOINTS.AUTH.LOGIN, payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        refresh();
      }
      return data;
    },
  });
}
