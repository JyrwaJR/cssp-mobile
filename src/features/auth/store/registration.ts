import { create } from 'zustand';
import { RegisterPensionerInput } from '../validators';

interface RegistrationStore {
  step: number;
  formData: RegisterPensionerInput;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  saveData: (data: Partial<RegisterPensionerInput>) => void;
  reset: () => void;
}

const defaultValue: RegisterPensionerInput = {
  ppo_no: '',
  dob: '',
  password: '',
  bank_account_number: '',
};

export const useRegistrationStore = create<RegistrationStore>((set, get) => ({
  step: 1,
  formData: defaultValue,

  setStep: (step) => set({ step }),
  nextStep: () => {
    if (get().step < 4) {
      set((state) => ({ step: state.step + 1 }));
    }
  },
  prevStep: () => {
    if (get().step > 1) {
      set((state) => ({ step: state.step - 1 }));
    }
  },

  saveData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  reset: () => set({ step: 1, formData: defaultValue }),
}));
