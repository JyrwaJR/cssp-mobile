import '@styles/index.css';
import 'react-native-get-random-values';
import { Stack } from 'expo-router';
import { ProviderWrapper } from '@components/providers';
import { SnackbarProvider } from '@components/ui/snackbar-provider';

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  return (
    <ProviderWrapper>
      <Stack screenOptions={{ headerShown: false }} />
      <SnackbarProvider />
    </ProviderWrapper>
  );
}
