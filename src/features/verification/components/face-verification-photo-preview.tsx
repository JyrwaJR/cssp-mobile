import React from 'react';
import { ScrollView, Text, Image } from 'react-native';
import { Button } from '@components/ui';

/** Props for {@link FaceVerificationPhotoPreviewStep}. */
export interface FaceVerificationPhotoPreviewStepProps {
  /** Data URI of the captured photo; empty string hides the image. */
  previewUri: string;
  /** Called by the Submit Photo button; parent opens the confirm dialog. */
  onSubmitPress: () => void;
}

/**
 * Registration-mode step confirming the first captured photograph
 * before submission. Displays the photo, authenticity/privacy notice
 * text, and the Submit Photo action. Purely presentational.
 */
export function FaceVerificationPhotoPreviewStep({
  previewUri,
  onSubmitPress,
}: FaceVerificationPhotoPreviewStepProps) {
  return (
    <ScrollView contentContainerClassName="items-center p-4">
      {previewUri ? (
        <Image
          source={{ uri: previewUri }}
          className="h-64 w-56 rounded-2xl border-2 border-primary"
        />
      ) : null}
      <Text className="mt-4 text-center text-sm text-foreground">
        This photo is required for the system to verify your Authenticity.
      </Text>
      <Text className="mt-2 text-center text-sm text-foreground">
        Please make sure that it is your photograph. Before submitting the photo, please read Our
        Privacy Policy.
      </Text>
      <Text className="mt-2 text-center text-sm font-bold text-destructive">
        [Note: The photo {`won't`} be used for any other purpose except for authenticating your
        Identity for Pension.]
      </Text>
      <Button size="lg" className="mt-6" onPress={onSubmitPress}>
        <Text className="text-base font-bold text-white">Submit Photo</Text>
      </Button>
    </ScrollView>
  );
}
