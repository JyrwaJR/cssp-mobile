import { View, Text, ActivityIndicator } from 'react-native';

/**
 * Full-screen busy indicator shown during the `capturing` and
 * `submitting` phases of FaceVerificationScreen. Static content;
 * no props, no side effects.
 */
export function FaceVerificationLoadingView() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-primary">Please wait</Text>
      <ActivityIndicator size="large" className="mt-4" />
    </View>
  );
}
