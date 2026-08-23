import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/http';
import { VerificationStatusT } from '../types';
import { ENDPOINTS } from '@utils/constants';

export function useVerificationStatus() {
  const ppo_no = 'mg/11xx';
  return useQuery({
    queryKey: ['verificationStatus', ppo_no],
    queryFn: () => http.post<VerificationStatusT>(ENDPOINTS.VERIFICATION.STATUS, { ppo_no }),
    select: (data) => data.data,
  });
}
