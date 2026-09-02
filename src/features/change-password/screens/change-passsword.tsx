import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Container } from '@components/layout';
import { Button, Input, Icon } from '@components/ui';
import { FooterImg } from '@components/common';

import { ChangePasswrodSchema } from '../validators';
import { useChangePassword } from '../hooks/use-change-password';
import { PasswordRequiredments } from '../components/password-req';
import { ChangePasswordConfirmDialog } from '../components/change-password-confirm-dialog';
import { formatPassword } from '@lib/encryption';

type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ChangePasswordScreen() {
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { mutate, isPending, isError, error, isSuccess } = useChangePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswrodSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'all',
  });

  const newPassword = useWatch({ name: 'newPassword', control: control });

  const onSubmit = (data: ChangePasswordForm) => {
    const isValid = ChangePasswrodSchema.safeParse(data);
    if (isValid.success)
      mutate({
        oldPassword: formatPassword(data.oldPassword),
        newPassword: formatPassword(data.newPassword),
      });
  };

  const toggleNewPasswordVisibility = () => setIsShowNewPassword((previous) => !previous);
  const toggleOldPasswordVisibility = () => setIsShowOldPassword((previous) => !previous);

  return (
    <Container scrollable>
      <View className="w-full gap-5">
        {/* Header */}
        <View className="gap-2">
          <View className="bg-primary/10 self-start py-1">
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">
              Security Change
            </Text>
          </View>

          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Change Password
          </Text>

          <Text className="text-sm font-medium text-muted-foreground">
            Update your account password to keep your pension profile secure.
          </Text>
        </View>

        {isSuccess ? (
          /* Success */
          <View className="my-4 items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
              <Icon name="check" size={24} color="white" />
            </View>

            <Text className="text-center text-base font-bold text-emerald-950">
              Password Changed Successfully
            </Text>

            <Text className="text-center text-xs leading-5 text-emerald-800">
              Your password has been updated. Please use your new password for future log ins.
            </Text>
          </View>
        ) : (
          /* Form */
          <View className="gap-4 rounded-md border border-gray-200/80 bg-card p-5">
            {/* API Error */}
            {isError && (
              <View className="border-destructive/30 bg-destructive/10 rounded-xl border p-3">
                <Text className="text-center text-xs font-semibold text-destructive">
                  {(error as any)?.response?.data?.message ||
                    'Failed to change password. Please try again.'}
                </Text>
              </View>
            )}

            {/* Old Password */}
            <View className="gap-1.5">
              <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Old Password
              </Text>

              <Controller
                control={control}
                name="oldPassword"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <View className="relative justify-center">
                      <Input
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!isShowOldPassword}
                        placeholder="Enter your old password"
                        error={!!errors.oldPassword?.message}
                        autoCapitalize="none"
                      />

                      <Pressable
                        onPress={toggleOldPasswordVisibility}
                        hitSlop={8}
                        className="absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center p-1"
                        accessibilityLabel={isShowOldPassword ? 'Hide password' : 'Show password'}>
                        {isShowOldPassword ? (
                          <Icon name="eye-open" />
                        ) : (
                          <Icon name="eye-close" size={20} />
                        )}
                      </Pressable>
                    </View>

                    {errors.oldPassword && (
                      <Text className="mt-1 text-sm text-destructive">
                        {errors.oldPassword.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* New Password */}
            <View className="gap-1.5">
              <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                New Password
              </Text>

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <View className="relative justify-center">
                      <Input
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!isShowNewPassword}
                        placeholder="Enter your new password"
                        error={!!errors.newPassword?.message}
                        autoCapitalize="none"
                      />

                      <Pressable
                        onPress={toggleNewPasswordVisibility}
                        hitSlop={8}
                        className="absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center p-1"
                        accessibilityLabel={isShowNewPassword ? 'Hide password' : 'Show password'}>
                        {isShowNewPassword ? (
                          <Icon name="eye-open" />
                        ) : (
                          <Icon name="eye-close" size={20} />
                        )}
                      </Pressable>
                    </View>

                    {errors.newPassword && (
                      <Text className="mt-1 text-sm text-destructive">
                        {errors.newPassword.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Password Requirements */}
            <PasswordRequiredments value={newPassword} />

            {/* Confirm Password */}
            <View className="gap-1.5">
              <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Confirm New Password
              </Text>

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <View className="relative justify-center">
                      <Input
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!isShowNewPassword}
                        placeholder="Retype your new password"
                        autoCapitalize="none"
                        error={!!errors.confirmPassword?.message}
                      />

                      <Pressable
                        onPress={toggleNewPasswordVisibility}
                        hitSlop={8}
                        className="absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center p-1"
                        accessibilityLabel={isShowNewPassword ? 'Hide password' : 'Show password'}>
                        {isShowNewPassword ? (
                          <Icon name="eye-open" />
                        ) : (
                          <Icon name="eye-close" size={20} />
                        )}
                      </Pressable>
                    </View>

                    {errors.confirmPassword && (
                      <Text className="mt-1 text-sm text-destructive">
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Submit */}
            <Button
              size="lg"
              onPress={() => setIsConfirmOpen(true)}
              disabled={isPending}
              isLoading={isPending}
              activeOpacity={0.8}>
              Change Password
            </Button>
          </View>
        )}

        <FooterImg />
      </View>

      {/* Confirmation dialog */}
      <ChangePasswordConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={() => {
          setIsConfirmOpen(false);
          handleSubmit(onSubmit)();
        }}
      />
    </Container>
  );
}
