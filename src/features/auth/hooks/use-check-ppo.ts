import { useMutation } from '@tanstack/react-query';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { http } from '@utils/http';
import { RegistrationStatusInput } from '../validators';
import { useRegistrationStore } from '../store/registration';

export function useCheckPPO() {
  const { nextStep, saveData } = useRegistrationStore();
  return useMutation({
    mutationFn: (data: RegistrationStatusInput) =>
      http.post(ENDPOINTS.USER.REGISTRATION_STATUS, data),
    onSuccess: (data, variables) => {
      if (data.success) {
        saveData({
          ppo_no: variables.ppo_no,
        });
        nextStep();
      }
      // On failure: intentionally no reset. The typed PPO stays visible
      // so the user can correct a single character instead of retyping.
    },
  });
}
