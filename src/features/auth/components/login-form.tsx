import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginInput, LoginSchema } from '../validators';
import { useLogin } from '../hooks/use-login';
import { useSnackbar } from '@hooks/use-snackbar';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Icon } from '@components/ui/icon';

const defaultValues = {
  username: process.env.EXPO_PUBLIC_USERNAME || '',
  password: process.env.EXPO_PUBLIC_PASSWORD || '',
};

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();
  const { showSnackbar } = useSnackbar();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit = (data: LoginInput) => {
    mutate(data, {
      onSuccess: (res) => {
        if (res?.success) {
          showSnackbar('Login successfully');
        } else {
          showSnackbar(res?.message || 'Login failed. Please try again.');
        }
      },
      onError: (error: any) => {
        showSnackbar(error?.message || 'Something went wrong');
      },
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <View className="w-full py-2">
      <Controller
        control={form.control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <View className="flex-row gap-1">
              <Text className="mb-1.5 text-sm  font-medium text-gray-700">Username</Text>
              <Text className="mb-1.5 text-sm  font-medium text-destructive">*</Text>
            </View>
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your PPO No."
              autoCapitalize="none"
              autoCorrect={false}
              error={!!form.formState.errors.username}
            />
            {form.formState.errors.username && (
              <Text className="mt-1 text-xs text-red-500">
                {form.formState.errors.username.message}
              </Text>
            )}
          </View>
        )}
      />
      {/* Password Field */}
      <Controller
        control={form.control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-6">
            <View className="flex-row gap-1">
              <Text className="mb-1.5 text-sm font-medium text-gray-700">Password</Text>
              <Text className="mb-1.5 text-sm  font-medium text-destructive">*</Text>
            </View>
            <View className="relative justify-center">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                error={!!form.formState.errors.password}
                className="pr-12"
              />
              <Pressable
                onPress={togglePasswordVisibility}
                hitSlop={8}
                className="absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center p-1"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <Icon name="eye-open" /> : <Icon name="eye-close" size={20} />}
              </Pressable>
            </View>
            {form.formState.errors.password && (
              <Text className="mt-1 text-xs text-red-500">
                {form.formState.errors.password.message}
              </Text>
            )}
          </View>
        )}
      />
      {/* Submit Button */}
      <Button
        isLoading={isPending}
        size="lg"
        disabled={isPending}
        onPress={form.handleSubmit(onSubmit)}
        className="w-full">
        Submit
      </Button>
    </View>
  );
};
