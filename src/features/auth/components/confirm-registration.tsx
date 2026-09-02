import { useState } from 'react';
import { View, Text } from 'react-native';
import { useRegistrationStore } from '../store/registration';
import { useRegisterPensioner } from '../hooks';
import { Button } from '@components/ui/button';
import { RegisterPensionerSchema } from '../validators';
import { useSnackbar } from '@hooks/use-snackbar';
import { useNetworkStatus } from '@hooks/use-network-status';
import { formatPassword } from '@lib/encryption';
import { RegistrationConfirmDialog } from './registration-confirm-dialog';

/**
 * Step 4 of registration: review and submit.
 *
 * Shows a summary card of all entered data (bank account and password
 * masked) with >=16px labels / 18px values, theme-token colors for dark
 * mode, and two equal-width actions: "Back & Edit" (preserves data) and
 * "Submit". A confirmation dialog appears before the final submission to
 * prevent accidental registrations.
 */
export function ConfirmRegistrationScreen() {
  const { formData, prevStep } = useRegistrationStore();
  const { showSnackbar } = useSnackbar();
  const { mutate: register, isPending: isRegistering } = useRegisterPensioner();
  const { isOffline } = useNetworkStatus();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  /**
   * Validates form data first. Opens the confirmation dialog only if
   * validation passes; otherwise shows a snackbar with the error.
   */
  const handleSubmitClick = () => {
    const isValidData = RegisterPensionerSchema.safeParse(formData);
    if (isValidData.success) {
      setIsConfirmOpen(true);
    } else {
      showSnackbar(
        isValidData.error.issues[0]?.message || 'Registration failed. Please try again.'
      );
    }
  };

  /**
   * Called when the user taps "Confirm" in the dialog.
   * Closes the dialog and fires the registration mutation.
   */
  const handleDialogConfirm = () => {
    setIsConfirmOpen(false);
    register({
      ...formData,
      password: formatPassword(formData.password),
    });
  };

  const maskBankAccount = (accountNumber?: string) => {
    if (!accountNumber) return 'N/A';
    if (accountNumber.length <= 6) return accountNumber;
    return `•••• •••• ${accountNumber.slice(-6)}`;
  };

  return (
    <View className="w-full gap-4">
      <View className="rounded-xl border border-border bg-card px-4 py-2">
        <View className="flex-row items-center justify-between border-b border-border py-3.5">
          <Text className="text-base text-muted-foreground">PPO Number</Text>
          <Text className="text-lg font-bold text-foreground">{formData.ppo_no || 'N/A'}</Text>
        </View>

        <View className="flex-row items-center justify-between border-b border-border py-3.5">
          <Text className="text-base text-muted-foreground">Date of Birth</Text>
          <Text className="text-lg font-bold text-foreground">{formData.dob || 'N/A'}</Text>
        </View>

        <View className="flex-row items-center justify-between border-b border-border py-3.5">
          <Text className="text-base text-muted-foreground">Bank Account</Text>
          <Text className="text-lg font-bold text-foreground">
            {maskBankAccount(formData.bank_account_number)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between py-3.5">
          <Text className="text-base text-muted-foreground">Password</Text>
          <Text className="text-lg font-bold text-foreground">••••••••</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Button
          size="lg"
          onPress={prevStep}
          variant="outline"
          disabled={isRegistering}
          className="flex-1">
          Back
        </Button>

        <Button
          size="lg"
          onPress={handleSubmitClick}
          disabled={isRegistering || isOffline}
          isLoading={isRegistering}
          className="flex-1">
          Submit
        </Button>
      </View>

      <RegistrationConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDialogConfirm}
        isPending={isRegistering}
      />
    </View>
  );
}
