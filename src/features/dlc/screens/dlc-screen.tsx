import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FooterImg, Ternary } from '@components/common';
import { Button, Icon, Alert, AlertTitle, AlertDescription } from '@components/ui';
import { useInitializeVerification } from '../hooks/use-init-verification';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import * as Linking from 'expo-linking';

// check if front camera is present in device before allowing to process with dlc
// if device does not present of front camera show message that i cannot be proceed
export function DLCScreen() {
  const router = useRouter();
  const frontCamera = useCameraDevice('front');
  const { hasPermission, requestPermission, canRequestPermission } = useCameraPermission();

  const isDisableCapture = frontCamera === null || !hasPermission;

  const { regStatus, msg } = useInitializeVerification();

  const handleCapturePress = () => {
    const isRegistrationRequired = regStatus === '03' || regStatus === '02';
    router.push({
      pathname: '/face-recognition',
      params: { registrationStatus: isRegistrationRequired ? '1' : '0' },
    });
  };

  const openSettings = async () => await Linking.openSettings();

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      {/* Main Content Area */}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 20 }}
        showsVerticalScrollIndicator={false}>
        {/* Instructions Card */}

        <View className="gap-2">
          <View className="bg-primary/10 self-start py-1">
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">
              Self Verification
            </Text>
          </View>

          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Digital Life Certificate
          </Text>

          <Text className="text-sm font-medium text-muted-foreground">
            Verify your identity with a photo
          </Text>
        </View>

        <View className="gap-4 rounded-md border border-gray-200 bg-card p-5">
          <View className="items-center border-b border-gray-200 pb-3">
            <Text className="text-center text-base font-bold uppercase tracking-wide text-foreground">
              Instructions
            </Text>
          </View>

          <View className="gap-3.5">
            <View className="bg-muted/30 flex-row items-center gap-3 rounded-md border border-gray-200 p-3.5">
              <View className="bg-primary/10 mt-0.5 h-6 w-6 items-center justify-center rounded-full">
                <Text className="text-md font-bold text-primary">1</Text>
              </View>
              <Text className="text-md flex-1 leading-5 text-muted-foreground">
                Click on the <Text className="font-semibold text-foreground">Capture Photo</Text>{' '}
                button below.
              </Text>
            </View>

            <View className="bg-muted/30 flex-row items-center gap-3 rounded-md border border-gray-200 p-3.5">
              <View className="bg-primary/10 mt-0.5 h-6 w-6 items-center justify-center rounded-full">
                <Text className="text-md font-bold text-primary">2</Text>
              </View>
              <Text className="text-md flex-1 leading-5 text-muted-foreground">
                When the camera opens, look straight into the camera and{' '}
                <Text className="font-semibold text-foreground">blink your eyes</Text>.
              </Text>
            </View>

            <View className="bg-muted/30 flex-row  items-center gap-3 rounded-md border border-gray-200 p-3.5">
              <View className="bg-primary/10 mt-0.5 h-6 w-6 items-center justify-center rounded-full">
                <Text className="text-md font-bold text-primary">3</Text>
              </View>
              <Text className="text-md flex-1 leading-5 text-muted-foreground">
                Wait for the system to process, submit, and verify your photo.
              </Text>
            </View>

            {/* Dynamic Status / Warning Banner */}
            {msg !== '' && (
              <Alert variant={'destructive'}>
                <Icon name="alert-circle" size={18} className="text-destructive" />
                <View className="flex-1">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription className="flex-1">{msg}</AlertDescription>
                </View>
              </Alert>
            )}
          </View>
        </View>

        {!hasPermission && (
          <Alert variant="destructive">
            <Icon name="alert-circle" size={18} className="mt-0.5 text-destructive" />

            <View className="flex-1">
              <AlertTitle>Camera Permission Required</AlertTitle>

              <AlertDescription>
                Camera access is required to continue. Please allow camera permission in your device
                settings.
              </AlertDescription>
            </View>
          </Alert>
        )}

        {hasPermission && !frontCamera && (
          <Alert variant="destructive">
            <Icon name="alert-circle" size={18} className="mt-0.5 text-destructive" />

            <View className="flex-1">
              <AlertTitle className="text-sm">Front Camera Not Available</AlertTitle>

              <AlertDescription>
                This device does not have a front-facing camera. A front camera is required to
                continue.
              </AlertDescription>
            </View>
          </Alert>
        )}

        {/* Primary Action Button | Check if camera Permission is granted */}
        {
          /* Partner Logos */
          <Ternary
            condition={hasPermission}
            ifTrue={
              <Button
                disabled={isDisableCapture}
                size="lg"
                onPress={handleCapturePress}
                activeOpacity={0.8}>
                Capture Photo
              </Button>
            }
            ifFalse={
              <Ternary
                condition={canRequestPermission}
                ifTrue={
                  <>
                    <Alert variant="destructive">
                      <Icon name="alert-circle" size={18} className="mt-0.5 text-destructive" />

                      <View className="flex-1">
                        <AlertTitle className="text-sm">Camera Access Required</AlertTitle>

                        <AlertDescription>
                          Camera access is required to capture a photo. Please grant camera
                          permission to continue.
                        </AlertDescription>
                      </View>
                    </Alert>

                    <Button
                      size="lg"
                      variant="outline"
                      onPress={requestPermission}
                      activeOpacity={0.8}>
                      Allow Camera Access
                    </Button>
                  </>
                }
                ifFalse={
                  <>
                    <Alert variant="destructive">
                      <Icon name="alert-circle" size={18} className="mt-0.5 text-destructive" />

                      <View className="flex-1">
                        <AlertTitle className="text-sm">Camera Access Blocked</AlertTitle>

                        <AlertDescription>
                          Camera permission has been denied. Please enable camera access in your app
                          settings to continue.
                        </AlertDescription>
                      </View>
                    </Alert>

                    <Button size="lg" variant="outline" onPress={openSettings} activeOpacity={0.8}>
                      Open App Settings
                    </Button>
                  </>
                }
              />
            }
          />
        }
        <FooterImg />
      </ScrollView>
    </SafeAreaView>
  );
}
