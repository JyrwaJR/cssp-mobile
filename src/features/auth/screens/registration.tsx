import { Text, View } from 'react-native';

import { RegistrationStatusForm, RegistrationPersonalForm } from '../components';
import { Container } from '@components/layout';
import { FooterImg } from '@components/common/nic-footer-img';
import { useRegistrationStore } from '../store/registration';
import { RegistrationPasswordForm } from '../components/registration-password-form';
import { ConfirmRegistrationScreen } from '../components/confirm-registration';
import { Button } from '@components/ui/button';
import { router } from 'expo-router';

export default function RegistrationScreen() {
  const { step } = useRegistrationStore();
  return (
    <Container className="flex-1 items-center justify-center gap-y-5">
      {/* Step 1 */}
      <View className="mt-4">
        <Text className="mb-4 text-center text-lg font-semibold tracking-widest text-primary">
          STEP No.{step}
        </Text>
        {step === 1 && <RegistrationStatusForm />}
        {step === 2 && <RegistrationPersonalForm />}
        {step === 3 && <RegistrationPasswordForm />}
        {step === 4 && <ConfirmRegistrationScreen />}
      </View>
      <View>
        <Button
          size="sm"
          variant={'link'}
          onPress={() => router.replace('/auth')}
          className="w-full">
          Back to Login Screen
        </Button>
      </View>

      <FooterImg />
    </Container>
  );
}
