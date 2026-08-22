import { router } from 'expo-router';
import { ScrollView, Text, View, Pressable, Linking } from 'react-native';
import { Button } from '@components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';

export function RegistrationInstructionScreen() {
  const handleEmailSupport = () => {
    Linking.openURL('mailto:dat-shil-meg@nic.in');
  };

  const handlePhoneSupport = () => {
    Linking.openURL('tel:03642226553');
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-8 gap-5"
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="mb-1 mt-2 items-center">
          <Text className="text-2xl font-bold text-gray-900">Registration Guide</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            Follow the steps below to register or update your password
          </Text>
        </View>

        {/* STEP 1 CARD */}
        <View className="gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <View className="flex-row items-center gap-2">
            <View className="bg-primary/10 h-7 w-7 items-center justify-center rounded-full">
              <Text className="text-sm font-bold text-primary">1</Text>
            </View>
            <Text className="text-base font-semibold text-gray-900">Verify PPO Status</Text>
          </View>

          <Text className="text-sm leading-relaxed text-gray-600">
            Enter your <Text className="font-semibold text-gray-800">PPO Number</Text> and tap{' '}
            <Text className="font-semibold text-gray-800">Get PPO Status</Text>.
          </Text>

          {/* Invalid PPO Alert Box */}
          <View className="mt-1 gap-2 rounded-xl border border-amber-200/60 bg-amber-50 p-3.5">
            <Text className="text-xs font-semibold text-amber-900">
              If your PPO No. is showing as Invalid:
            </Text>
            <Text className="text-xs leading-relaxed text-amber-800">
              Please reach out to support or visit your nearest Treasury Office.
            </Text>

            <View className="mt-1 flex-row flex-wrap gap-2">
              <Pressable
                onPress={handleEmailSupport}
                className="rounded-lg bg-amber-100/80 px-2.5 py-1.5 active:opacity-70">
                <Text className="text-xs font-semibold text-amber-900">✉ dat-shil-meg@nic.in</Text>
              </Pressable>

              <Pressable
                onPress={handlePhoneSupport}
                className="rounded-lg bg-amber-100/80 px-2.5 py-1.5 active:opacity-70">
                <Text className="text-xs font-semibold text-amber-900">📞 0364-2226553</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* STEP 2 CARD */}
        <View className="gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <View className="flex-row items-center gap-2">
            <View className="bg-primary/10 h-7 w-7 items-center justify-center rounded-full">
              <Text className="text-sm font-bold text-primary">2</Text>
            </View>
            <Text className="text-base font-semibold text-gray-900">
              Provide Verification Details
            </Text>
          </View>

          {/* Item A */}
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-gray-800">1. Date of Birth (DOB)</Text>

            {/* Family Pensioner Callout */}
            <View className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
              <Text className="text-xs leading-relaxed text-blue-950">
                <Text className="font-bold text-blue-900">Family Pensioners: </Text>
                Do not enter your own DOB. Enter the DOB of the deceased primary pensioner from whom
                pension is received.
              </Text>
            </View>
          </View>

          {/* Item B */}
          <View className="gap-1">
            <Text className="text-sm font-medium text-gray-800">2. Bank Account Number</Text>
            <Text className="text-xs text-gray-500">
              Enter the bank account where your pension is currently credited.
            </Text>
          </View>

          {/* Item C */}
          <View className="gap-1">
            <Text className="text-sm font-medium text-gray-800">3. Set Password</Text>
            <Text className="text-xs text-gray-500">
              Create a secure password for logging into your account.
            </Text>
          </View>
        </View>

        {/* Important Notice Callout */}
        <View className="flex-row items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5">
          <Text className="text-base font-bold text-red-600">!</Text>
          <Text className="flex-1 text-xs font-medium text-red-700">
            Please make sure all information provided matches your official treasury records before
            proceeding.
          </Text>
        </View>

        {/* Action Button */}
        <Button size="lg" onPress={() => router.push('/auth/register')}>
          Proceed to Registration
        </Button>

        {/* Footer Branding */}
        <View className="mt-4 items-center gap-1">
          <Text className="text-xs font-semibold text-gray-400">NATIONAL INFORMATICS CENTRE</Text>
          <Text className="text-[11px] text-gray-400">Powered by NIC • Meghalaya State Centre</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
