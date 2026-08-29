import { View, Text } from 'react-native';
import { Alert, AlertDescription, Icon, AlertTitle, Button } from '@components/ui';
import { Container } from '@components/layout';
import { FooterImg } from '@components/common';
import { router } from 'expo-router';

/** Props for {@link FaceVerificationErrorView}. */
export interface FaceVerificationErrorViewProps {
  /** Human-readable failure message displayed in the alert body. */
  errorMsg: string;
  /** Invoked by the Go Back button; parent wires `router.back()`. */
  onTryAgainPress?: () => void;
}

/**
 * Renders a destructive alert with the failure reason and a Go Back
 * button for the error phase of FaceVerificationScreen. Purely
 * presentational; navigation is delegated via `onGoBack`.
 */
export function FaceVerificationErrorView({
  errorMsg,
  onTryAgainPress,
}: FaceVerificationErrorViewProps) {
  return (
    <Container className="gap-5">
      <View className="gap-2">
        <View className="bg-primary/10 self-start py-1">
          <Text className="text-xs font-bold uppercase tracking-wider text-primary">Error</Text>
        </View>

        <Text className="text-2xl font-extrabold tracking-tight text-foreground">
          Something went wrong
        </Text>

        <Text className="text-sm font-medium text-muted-foreground">Please try again.</Text>
      </View>
      <View className="items-center justify-center gap-5">
        <Alert variant="destructive">
          <Icon name="info" size={18} className="mt-0.5 text-destructive" />
          <View className="flex-1">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </View>
        </Alert>

        <View className="gap-2">
          {onTryAgainPress && (
            <Button
              size="lg"
              className="w-full"
              onPress={() => onTryAgainPress && onTryAgainPress()}>
              Try Again
            </Button>
          )}
          <Button size="lg" variant={'secondary'} className="w-full" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </View>
      <FooterImg />
    </Container>
  );
}
