import { View, Text } from 'react-native';
import { LoginForm } from '../components';

export function LoginScreen() {
  return (
    <View className="h-screen w-full flex-1 items-center justify-center p-4">
      <View className="w-full">
        <LoginForm />
      </View>
    </View>
  );
}
