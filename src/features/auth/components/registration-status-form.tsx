import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { RegistrationStatusInput, RegistrationStatusSchema } from '../validators';
import { View, Text } from 'react-native';
import { Button } from '@components/ui/button';
import { useCheckPPO } from '../hooks';
import { Input } from '@components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Icon } from '@components/ui/icon';
import { cn } from '@utils/helpers';

export const RegistrationStatusForm = () => {
  const { mutate, isPending, data, isSuccess } = useCheckPPO();

  const form = useForm<RegistrationStatusInput>({
    resolver: zodResolver(RegistrationStatusSchema),
  });

  const onSubmit = (data: RegistrationStatusInput) => {
    mutate(data);
  };

  return (
    <View className="w-full gap-4 py-2">
      <View className="flex-col items-center justify-center gap-2">
        <Text className="text-center text-lg font-semibold">Enter your PPO No.</Text>
        <Text className="text-center text-sm text-gray-500">
          Please enter your PPO Number to check your registration status
        </Text>
      </View>
      {isSuccess && (
        <Alert variant={data.success ? 'success' : 'destructive'}>
          <Icon
            name="info"
            size={18}
            className={cn('mt-0.5', data.success ? 'text-green-500' : 'text-destructive')}
          />
          <View className="flex-1">
            <AlertTitle>{data.success ? 'PPO Status Success' : 'PPO Status Error'}</AlertTitle>
            <AlertDescription>{data?.message}</AlertDescription>
          </View>
        </Alert>
      )}
      <Controller
        control={form.control}
        name="ppo_no"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <View className="flex-row gap-1">
              <Text className="mb-1.5 text-sm  font-medium text-gray-700">PPO Number</Text>
              <Text className="mb-1.5 text-sm  font-medium text-destructive">*</Text>
            </View>
            <Input
              value={value}
              onChangeText={(v) => {
                return onChange(v.toUpperCase());
              }}
              onBlur={onBlur}
              placeholder="Enter your PPO No."
              autoCapitalize="none"
              autoCorrect={false}
              error={!!form.formState.errors.ppo_no}
            />
            {form.formState.errors.ppo_no && (
              <Text className="mt-1 text-xs text-red-500">
                {form.formState.errors.ppo_no.message}
              </Text>
            )}
          </View>
        )}
      />
      <Button
        isLoading={isPending}
        size="lg"
        disabled={isPending}
        onPress={form.handleSubmit(onSubmit)}>
        Get PPO Status
      </Button>
    </View>
  );
};
