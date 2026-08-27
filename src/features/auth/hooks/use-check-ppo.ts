import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/http';
import { RegistrationStatusInput } from '../validators';
import { useRegistrationStore } from '../store/registration';

type PPOStatus = {
  bank_account_no: string;
  dob: string;
  status: string;
};

export function useCheckPPO() {
  const { nextStep, saveData, setValidationData } = useRegistrationStore();
  return useMutation({
    mutationFn: (data: RegistrationStatusInput) =>
      http.post<PPOStatus>(ENDPOINTS.USER.REGISTRATION_STATUS, data),
    onSuccess: (data, variables) => {
      if (data.success) {
        saveData({ ppo_no: variables.ppo_no });
        if (data.data?.dob && data.data.bank_account_no) {
          setValidationData({
            bank_account_number: data.data?.bank_account_no,
            dob: data.data?.dob,
          });
          nextStep();
        }
      }
      // On failure: intentionally no reset. The typed PPO stays visible
      // so the user can correct a single character instead of retyping.
    },
  });
}
