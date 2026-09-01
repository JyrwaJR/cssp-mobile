import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Container } from '@components/layout';
import { Button, Icon } from '@components/ui';
import { APP_LINKS, APP_VERSION, PAGE_ROUTES } from '@utils/constants';
import { openPhoneNumber } from '@utils/helpers';

import { FooterImg } from '@components/common';

/**
 * Senior-friendly user manual screen for the Pensioner app.
 *
 * Shows a shared header (title, emergency helpline and privacy-policy link)
 * above a two-tab segmented control. The "Getting Started" tab covers setup
 * and registration, while the "Using the App" tab covers daily usage. Each
 * tab's content scrolls independently; the helpline buttons dial numbers via
 * {@link openPhoneNumber}, and the section components open the Play Store and
 * email links.
 *
 * @returns The rendered user manual screen.
 */
export function UserManualScreen() {
  return (
    <SafeAreaView edges={['right', 'left']} className="flex-1">
      <Container className="gap-5">
        <View className="gap-2 pt-2">
          <View className="bg-primary/10 self-start py-1">
            <Text className="text-sm font-bold uppercase tracking-wider text-primary">
              Government of Meghalaya • Finance Department
            </Text>
          </View>

          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Pensioner App User Guide
          </Text>

          <Text className="text-sm font-medium text-muted-foreground">
            Easy Step-by-Step Instructions {APP_VERSION}
          </Text>
        </View>

        {/* Main Title Hero Card */}

        <View className="gap-4 rounded-md border border-blue-600 bg-blue-50 p-4 ">
          {/* Emergency Helpline Box */}
          <View className="mt-2 w-full gap-3 rounded-md border border-blue-300 bg-white p-5 ">
            <Text className="text-center text-sm font-black uppercase tracking-wider text-slate-800">
              📞 Need help? Tap a number to call us directly:
            </Text>
            <View className="gap-3">
              <Button
                size="lg"
                activeOpacity={0.8}
                onPress={() => openPhoneNumber(APP_LINKS.PHONE.HELP_LINE_1)}>
                📞 Call {APP_LINKS.PHONE.HELP_LINE_1}
              </Button>

              <Button
                size="lg"
                activeOpacity={0.8}
                onPress={() => openPhoneNumber(APP_LINKS.PHONE.HELP_LINE_2)}>
                📞 Call {APP_LINKS.PHONE.HELP_LINE_2}
              </Button>
            </View>
          </View>

          {/* Quick Link to Privacy Policy */}
          <View className="gap-3 rounded-md border border-border bg-card p-4">
            <View className="flex-row items-center gap-3">
              <View className="bg-primary/10 h-9 w-9 items-center justify-center rounded-full">
                <Icon name="book-01" size={18} className="text-primary" />
              </View>
              <Text className="flex-1 text-base font-semibold text-foreground">Privacy Policy</Text>
            </View>

            <Text className="text-center text-base leading-relaxed text-muted-foreground">
              Review how your personal data is collected, used, and protected in the{' '}
              <Text className="font-semibold text-foreground">Privacy Policy</Text>.
            </Text>

            <Button
              variant="outline"
              size="lg"
              onPress={() => router.push(PAGE_ROUTES.PRIVACY)}
              className="flex-row items-center gap-2"
              accessibilityLabel="Open privacy policy">
              <Icon name="book-01" size={18} className="text-primary" />
              <Text className="text-base font-semibold text-primary">Privacy Policy</Text>
            </Button>
          </View>
        </View>
        <Button size={'lg'} onPress={() => router.push('/user-manual/change-password')}>
          Change Password
        </Button>
        <Button size={'lg'} onPress={() => router.push('/user-manual/dlc')}>
          DLC
        </Button>
        <Button size={'lg'} onPress={() => router.push('/user-manual/getting-started')}>
          Getting Started
        </Button>
        <FooterImg />
      </Container>
    </SafeAreaView>
  );
}
