import { LoginScreen } from '@features/auth/screens';
import { Stack } from 'expo-router';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <LoginScreen />
    </>
  );
}
