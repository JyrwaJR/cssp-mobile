import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/http';
import { VerificationStatusT } from '../types';
import { ENDPOINTS } from '@utils/constants';

export function useVerificationStatus() {
  return useQuery({
    queryKey: ['verificationStatus'],
    queryFn: () =>
      http.post<VerificationStatusT>(ENDPOINTS.VERIFICATION.STATUS, {
        // TODO: Replace with actual ppo_no
        ppo_no: 'MG/11XX',
      }),
    select: (data) => data.data,
  });
}
