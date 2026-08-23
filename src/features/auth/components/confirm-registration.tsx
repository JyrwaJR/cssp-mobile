import { View, Text } from 'react-native';
import { useRegistrationStore } from '../store/registration';
import { useRegisterPensioner } from '../hooks';
import { Button } from '@components/ui/button';
import { RegisterPensionerSchema } from '../validators';
import { useSnackbar } from '@hooks/use-snackbar';

export function ConfirmRegistrationScreen() {
  const { formData, prevStep } = useRegistrationStore();
  const { showSnackbar } = useSnackbar();
  const { mutate: register, isPending: isRegistering } = useRegisterPensioner();

  const handleConfirm = () => {
    const isValidData = RegisterPensionerSchema.safeParse(formData);
    if (isValidData.success) {
      register(formData);
    } else {
      showSnackbar(
        isValidData.error.issues[0]?.message || 'Registration failed. Please try again.'
      );
    }
  };

  const maskBankAccount = (accountNumber?: string) => {
    if (!accountNumber) return 'N/A';
    if (accountNumber.length <= 4) return accountNumber;
    return `•••• •••• ${accountNumber.slice(-4)}`;
  };

  return (
    <View className="flex-1 bg-[#F8F9FA] p-5">
      <Text className="mb-1.5 text-[22px] font-bold text-[#1A1A1A]">Confirm Details</Text>
      <Text className="mb-5 text-sm text-[#6C757D]">
        Review your information before completing registration.
      </Text>

      <View className="mb-6 rounded-xl border border-border bg-white px-4 py-2">
        <View className="flex-row items-center justify-between border-b border-[#F1F3F5] py-[14px]">
          <Text className="text-sm text-[#6C757D]">PPO Number</Text>
          <Text className="text-[15px] font-semibold text-[#212529]">
            {formData.ppo_no || 'N/A'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between border-b border-[#F1F3F5] py-[14px]">
          <Text className="text-sm text-[#6C757D]">Date of Birth</Text>
          <Text className="text-[15px] font-semibold text-[#212529]">{formData.dob || 'N/A'}</Text>
        </View>

        <View className="flex-row items-center justify-between border-b border-[#F1F3F5] py-[14px]">
          <Text className="text-sm text-[#6C757D]">Bank Account</Text>
          <Text className="text-[15px] font-semibold text-[#212529]">
            {maskBankAccount(formData.bank_account_number)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between py-[14px]">
          <Text className="text-sm text-[#6C757D]">Password</Text>
          <Text className="text-[15px] font-semibold text-[#212529]">••••••••</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Button size={'lg'} onPress={prevStep} variant={'secondary'} disabled={isRegistering}>
          Back & Edit
        </Button>

        <Button size={'lg'} onPress={handleConfirm} disabled={isRegistering}>
          Confirm & Submit
        </Button>
      </View>
    </View>
  );
}
