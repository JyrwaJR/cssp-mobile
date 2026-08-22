import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { LoginForm } from '../components';
import { Container } from '@components/layout';
import { Link } from 'expo-router';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { Icon } from '@components/ui/icon';

export function LoginScreen() {
  const onPressUserManual = async () => {
    if (await Linking.canOpenURL(ENDPOINTS.DOCUMENTATION.MANUAL)) {
      await Linking.openURL(ENDPOINTS.DOCUMENTATION.MANUAL);
    }
  };

  return (
    <Container className="flex-1 items-center justify-center gap-5 py-5">
      <Icon name="user-unlock" size={70} className="text-primary" />
      <View className="items-center gap-1">
        <Text className="text-2xl font-bold text-gray-900">Welcome Back</Text>
        <Text className="mt-1 text-sm text-gray-500">Login to your account</Text>
      </View>

      <LoginForm />

      <View className="flex-row items-center justify-center gap-1.5">
        <Text className="text-sm text-gray-500">{`Don't`} have an account?</Text>
        <Link href="/auth/reg-instruction" asChild>
          <Text className="text-sm font-semibold text-primary active:opacity-70">Sign Up</Text>
        </Link>
      </View>
      <View className="flex-row items-center justify-center gap-1.5">
        <TouchableOpacity onPress={onPressUserManual} className="text-sm text-gray-500">
          <Text className="text-sm font-semibold text-primary active:opacity-70">User Manual</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
