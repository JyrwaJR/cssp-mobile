import { useAuthStore } from '@stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { http } from '@utils/http';
import { PensionStatementResponseI } from '../types';
import { ENDPOINTS } from '@utils/constants';
import { encryptText } from '@lib/encryption';
import { TokenStoreManager } from '@stores/token.store';

export function usePensionerStatement() {
  const { user } = useAuthStore();
  const ppoNo = user?.ppo_no;
  return useQuery({
    queryKey: ['pensioner', 'statement', ppoNo],
    queryFn: async () => {
      const encData = encryptText(JSON.stringify({ ppo_no: ppoNo }));
      const token = await TokenStoreManager.getDatAccessToken();
      return http.post<PensionStatementResponseI>(
        ENDPOINTS.PENSIONER_STATEMENTS.SIX_MONTH_STATEMENTS,
        encData,
        { headers: { Authorization: `Barrier ${token}` } }
      );
    },
    select: (data) => data.data,
  });
}
