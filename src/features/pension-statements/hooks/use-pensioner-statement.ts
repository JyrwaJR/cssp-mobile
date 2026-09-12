import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/http';
import { PensionerStatement } from '../types';
import { ENDPOINTS } from '@utils/constants';

export function usePensionerStatement() {
  const { user } = useAuthStore();
  const ppoNo = user?.ppo_no;
  return useQuery({
    queryKey: ['pensioner', 'statement', ppoNo],
    queryFn: () =>
      http.get<{ data: PensionerStatement[]; base64: string }>(
        ENDPOINTS.PENSIONER_STATEMENTS.SIX_MONTH_STATEMENTS
      ),
    select: (data) => data.data,
  });
}
