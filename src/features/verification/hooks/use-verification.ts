import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants';
import { http } from '@utils/http';

export function useVerification() {
  return useMutation({
    mutationFn: () => http.post(ENDPOINTS.VERIFICATION.VERIFICATION),
    onSuccess: () => {},
    onError: () => {},
  });
}
