import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FooterImg } from '@components/common';
import { Button, Icon } from '@components/ui';
import { useInitializeVerification } from '../hooks/use-init-verification';

export function VerificationScreen() {
  const router = useRouter();

  const { data, regStatus, dlcStatus, msg } = useInitializeVerification();

  const handleCapturePress = () => {
    const isRegistrationRequired = regStatus === '03' || regStatus === '02';
    router.push({
      pathname: '/face-recognition',
      params: { registrationStatus: isRegistrationRequired ? '1' : '0' },
    });
  };

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 20 }}
        showsVerticalScrollIndicator={false}>
        {/* Instructions Card */}

        <View className="gap-2">
          <View className="bg-primary/10 self-start py-1">
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">Photo</Text>
          </View>

          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Photo Verification
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
              <View className="flex-row items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3.5">
                <Icon name="alert-circle" size={18} color="#DC2626" className="mt-0.5" />
                <Text className="text-md flex-1 font-medium leading-5 text-red-700">{msg}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Primary Action Button */}
        <Button size={'lg'} onPress={handleCapturePress} activeOpacity={0.8}>
          <Text className="text-base font-bold text-white">Capture Photo</Text>
        </Button>

        {/* Partner Logos */}
        <FooterImg />
      </ScrollView>
    </SafeAreaView>
  );
}
