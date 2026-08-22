import '@styles/index.css';

import { Stack } from 'expo-router';
import { ProviderWrapper } from '@components/providers';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </ProviderWrapper>
  );
}
