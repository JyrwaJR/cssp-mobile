import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInput, LoginSchema } from '../validators';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useLogin } from '../hooks/use-login';
import { useSnackbar } from '@hooks/use-snackbar';

const defaultValues = {
  username: process.env.EXPO_PUBLIC_USERNAME || '',
  password: process.env.EXPO_PUBLIC_PASSWORD || '',
};

export const LoginForm = () => {
  const { mutate, isPending } = useLogin();
  const { showSnackbar } = useSnackbar();
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit = (data: LoginInput) =>
    mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          showSnackbar('Login successful');
        }
      },
    });

  return (
    <View className="w-full border border-red-500">
      <Text className="mb-2 text-center text-2xl font-bold">Welcome Back</Text>

      <Text className="mb-8 text-center text-[15px] text-gray-500">Login to your account</Text>

      <Controller
        control={form.control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold">Username</Text>

            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your username"
              autoCapitalize="none"
              className="h-12 rounded-lg border border-gray-300 px-3.5 text-base"
            />

            {form.formState.errors.username && (
              <Text className="mt-1 text-xs text-red-600">
                {form.formState.errors.username.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold">Password</Text>

            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              className="h-12 rounded-lg border border-gray-300 px-3.5 text-base"
            />

            {form.formState.errors.password && (
              <Text className="mt-1 text-xs text-red-600">
                {form.formState.errors.password.message}
              </Text>
            )}
          </View>
        )}
      />

      <Pressable
        disabled={isPending}
        className="mt-2 h-12 items-center justify-center rounded-lg bg-gray-900"
        onPress={form.handleSubmit(onSubmit)}>
        <Text className="text-base font-semibold text-white">Login</Text>
      </Pressable>
    </View>
  );
};
