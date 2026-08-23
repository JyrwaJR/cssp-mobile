import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { RegisterPersonalInfoSchema, RegisterPersonalInfoInput } from '../validators';
import { View, Text } from 'react-native';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useRegistrationStore } from '../store/registration';

export const RegistrationPersonalForm = () => {
  const { nextStep, reset, saveData, formData } = useRegistrationStore();

  const form = useForm<RegisterPersonalInfoInput>({
    resolver: zodResolver(RegisterPersonalInfoSchema),
    defaultValues: { dob: formData.dob, bank_account_number: formData.bank_account_number },
    mode: 'onTouched',
  });

  const onSubmit = (data: RegisterPersonalInfoInput) => {
    const isValid = RegisterPersonalInfoSchema.safeParse(data).success;
    if (isValid) {
      saveData(data);
      nextStep();
    }
  };

  return (
    <View className="w-full gap-4 py-2">
      <View className="flex-col items-center justify-center gap-2">
        <Text className="text-center text-lg font-semibold">Personal Information</Text>
        <Text className="text-center text-sm text-gray-500">
          Please enter your personal information
        </Text>
      </View>
      <Controller
        control={form.control}
        name="dob"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <View className="flex-row gap-1">
              <Text className="mb-1.5 text-sm  font-medium text-gray-700">
                Date of Birth (YYYY-MM-DD)
              </Text>
              <Text className="mb-1.5 text-sm  font-medium text-destructive">*</Text>
            </View>
            <Input
              value={value}
              onChangeText={(v) => {
                const formatted = v
                  .replace(/\D/g, '')
                  .replace(/^(\d{4})(\d)/, '$1-$2')
                  .replace(/^(\d{4}-\d{2})(\d)/, '$1-$2')
                  .slice(0, 10);
                onChange(formatted);
              }}
              onBlur={onBlur}
              placeholder="Enter your Date of Birth"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!form.formState.errors.dob}
            />
            <Text className="mt-1 text-sm text-gray-700">
              Note: Date of birth(DOB) should be of a serviced Pensioner.
            </Text>
            {form.formState.errors.dob && (
              <Text className="mt-1 text-xs text-destructive">
                {form.formState.errors.dob.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={form.control}
        name="bank_account_number"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <View className="flex-row gap-1">
              <Text className="mb-1.5 text-sm  font-medium text-gray-700">Bank Account Number</Text>
              <Text className="mb-1.5 text-sm  font-medium text-destructive">*</Text>
            </View>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your Bank Account Number"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!form.formState.errors.bank_account_number}
            />
            {form.formState.errors.bank_account_number && (
              <Text className="mt-1 text-xs text-destructive">
                {form.formState.errors.bank_account_number.message}
              </Text>
            )}
          </View>
        )}
      />
      <View className="gap-2">
        <View className="w-full flex-row items-center gap-3">
          {/* Previous Step Button */}
          <Button variant="outline" size="lg" onPress={reset} className="flex-1">
            Cancel
          </Button>

          {/* Next Step Button */}
          <Button
            isLoading={form.formState.isSubmitting}
            size="lg"
            disabled={!form.formState.isValid}
            onPress={form.handleSubmit(onSubmit)}
            className="flex-1">
            Next Step
          </Button>
        </View>
      </View>
    </View>
  );
};
