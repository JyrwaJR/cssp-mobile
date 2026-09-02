import { View } from 'react-native';

import {
  ConfirmRegistrationScreen,
  RegistrationPasswordForm,
  RegistrationPersonalForm,
  RegistrationStatusForm,
  RegistrationStepHeader,
  RegistrationSuccessView,
} from '../components';
import { Container } from '@components/layout';
import { FooterImg } from '@components/common/nic-footer-img';
import { useRegistrationStore } from '../store/registration';

/**
 * Four-step pensioner registration wizard shell.
 *
 * Renders a large-print step header with progress bar and the active step
 * form. Content is top-aligned so the keyboard cannot shift layout.
 *
 * After a successful submit, the entire step content (header, form, footer)
 * is replaced by the success view, which resets the wizard and returns the
 * user to login.
 *
 * @returns The rendered registration screen.
 */
export default function RegistrationScreen() {
  const { step, isSuccess } = useRegistrationStore();

  if (isSuccess) {
    return (
      <Container className="flex-1 gap-5 py-10">
        <View className="mt-6 w-full">
          <RegistrationSuccessView />
        </View>
      </Container>
    );
  }

  return (
    <Container className="flex-1 gap-5 py-10">
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
