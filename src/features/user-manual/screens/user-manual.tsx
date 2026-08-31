import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Container } from '@components/layout';
import { Button } from '@components/ui';
import { APP_LINKS, APP_VERSION } from '@utils/constants';
import { openPhoneNumber } from '@utils/helpers';

import { UserManualTabs, type UserManualTabId } from '../components';
import { GettingStartedSections, UsingAppSections } from '../sections';

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
  const [activeTab, setActiveTab] = useState<UserManualTabId>('getting-started');

  return (
    <SafeAreaView edges={['right', 'left']} className="flex-1">
      <Container scrollable={false}>
        <View className="gap-5">
          <View className="gap-2 px-6 pt-2">
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
          <View className="mx-6 gap-4 rounded-md border border-blue-600 bg-blue-50 p-6 ">
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
            <Button size={'lg'} onPress={() => router.push('/privacy-policy')}>
              📄 View App Privacy Policy
            </Button>
          </View>

          {/* Segmented Tab Control */}
          <View className="px-6">
            <UserManualTabs activeTab={activeTab} onChange={setActiveTab} />
          </View>

          {/* Active Tab Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-5 p-6 pt-2"
            className="w-full flex-1">
            {activeTab === 'getting-started' ? <GettingStartedSections /> : <UsingAppSections />}
          </ScrollView>
        </View>
      </Container>
    </SafeAreaView>
  );
}
