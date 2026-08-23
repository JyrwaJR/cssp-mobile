import { View } from 'react-native';

import {
  ConfirmRegistrationScreen,
  RegistrationPasswordForm,
  RegistrationPersonalForm,
  RegistrationStatusForm,
  RegistrationStepHeader,
} from '../components';
import { Container } from '@components/layout';
import { FooterImg } from '@components/common/nic-footer-img';
import { useRegistrationStore } from '../store/registration';

/**
 * Four-step pensioner registration wizard shell.
 *
 * Renders a top-corner exit that RESETS the flow before navigating back
 * to login (prevents stale half-finished data on shared devices), a
 * large-print step header with progress bar, and the active step form.
 * Content is top-aligned so the keyboard cannot shift layout.
 *
 * @returns The rendered registration screen.
 */
export default function RegistrationScreen() {
  const { step } = useRegistrationStore();
  return (
    <Container className="flex-1 py-10">
      {/* Step X of 4 + progress bar + title + instruction */}
      <RegistrationStepHeader step={step} />

      {/* Active step form */}
      <View className="mt-6 w-full">
        {step === 1 && <RegistrationStatusForm />}
        {step === 2 && <RegistrationPersonalForm />}
        {step === 3 && <RegistrationPasswordForm />}
        {step === 4 && <ConfirmRegistrationScreen />}
      </View>

      {/* Anchored to viewport bottom when content is short */}
      <View className="mt-auto pt-6">
        <FooterImg />
      </View>
    </Container>
  );
}
