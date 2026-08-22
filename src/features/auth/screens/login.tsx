import { TouchableOpacity, View, Text } from 'react-native';
import { useLogin } from '../hooks/use-login';

export function LoginScreen() {
  const { mutate, isPending } = useLogin();
  const password =
    'gAAAAABqiC_DHmRi4drx2JHBaoRC5QqLkdQ4-DVOwrpBO9zyubuE3pk0tqXcUvuKD6jRmO4YGGS3RwdSbMYAc3IDerk2KTwAU_yccs71k-DeYyKOEJsbLYbMOEPT-WT1pjvNy5R8qqT7HNZ9MNlOwKDeeaE6PcTXmwqM5qAmXh7ihoOFIN0J0g_GDAXPS635ISc8GFgfr0Z9LW6xzvMKGX0WVti3GUqvUAVkvq0kvQYEiBiP2FVOfr4SVDTh4Vu1HReekZ_X3DEgT6QdzelZ8OQpoecxpal9AVAqNYOJIxq9fGrP1OuYXk2a-ZpYkVqfaCGd1gpQ86yb';
  const username =
    'gAAAAABqiC_DFjgr6n0qB4SDp-OkauwgnIdWaMSr1oU1cUQUsvmLMq6DCWdAMFSmtdSCoxA3XU2jqQj8Asq0_uTijnUJAHpeZQ==';

  return (
    <View className="h-screen flex-1 items-center justify-center">
      <TouchableOpacity
        onPress={() => {
          console.log('login');
          mutate({
            username: username,
            password: password,
          });
        }}
        className="bg-blue-500 p-5">
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
