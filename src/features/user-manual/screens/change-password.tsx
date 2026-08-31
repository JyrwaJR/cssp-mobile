import { Text, View } from 'react-native';
import { FooterImg } from '@components/common';

import {
  UserManualSectionCard as SectionCard,
  UserManualStepImage as StepImage,
} from '../components';
import { Container } from '@components/layout';

/**
 * "Using the App" tab content for the Pensioner app user manual.
 *
 * Renders sections 7–10 covering photo submission, approval status checks,
 * changing the password and the MEDA assistant, followed by the bottom
 * partner logos.
 *
 * @returns The using-the-app section cards rendered as a vertical stack.
 */
export function UserManualChangePasswordScreen() {
  return (
    <Container className="gap-5">
      {/* 7. Submit Photo & Declaration */}
      <SectionCard stepNumber="1" title="How to Change Password">
        <Text className="text-lg font-medium leading-7 text-slate-900">
          If you want to choose a new password, select{' '}
          <Text className="font-black text-blue-800">&quot;Change Password&quot;</Text> from the app
          Drawer.
        </Text>
        <StepImage
          placeholderText="Change Password Screen"
          caption="Type your current password and new password"
        />
      </SectionCard>
      {/* Bottom Logos */}
      <View className="mt-4 py-6">
        <FooterImg />
      </View>
    </Container>
  );
}
