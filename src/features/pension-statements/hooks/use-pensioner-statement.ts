import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants';
import { http } from '@utils/http';

export function usePensionerStatement() {
  const { user } = useAuthStore();
  const ppoNo = user?.ppo_no;
  return useQuery({
    queryKey: ['pensioner', 'statement', ppoNo],
    queryFn: () => http.get(ENDPOINTS.PENSIONER_STATEMENTS.SIX_MONTH_STATEMENTS),
    select: (data) => data.data,
  });
}
