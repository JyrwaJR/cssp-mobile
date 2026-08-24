import React from 'react';
import { View, Text } from 'react-native';
import { Alert, AlertDescription, AlertTitle, Button } from '@components/ui';

/** Props for {@link FaceVerificationErrorView}. */
export interface FaceVerificationErrorViewProps {
  /** Human-readable failure message displayed in the alert body. */
  errorMsg: string;
  /** Invoked by the Go Back button; parent wires `router.back()`. */
  onGoBack: () => void;
}

/**
 * Renders a destructive alert with the failure reason and a Go Back
 * button for the error phase of FaceVerificationScreen. Purely
 * presentational; navigation is delegated via `onGoBack`.
 */
export function FaceVerificationErrorView({ errorMsg, onGoBack }: FaceVerificationErrorViewProps) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMsg}</AlertDescription>
      </Alert>
      <Button size="lg" variant="outline" className="mt-6" onPress={onGoBack}>
        <Text className="text-base font-bold text-primary">Go Back</Text>
      </Button>
    </View>
  );
}
