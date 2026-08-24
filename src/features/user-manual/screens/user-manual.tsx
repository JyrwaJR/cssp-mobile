import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FooterImg } from '@components/common';
import { Container } from '@components/layout';
import { Button } from '@components/ui';
import { APP_LINKS, APP_VERSION } from '@utils/constants';
import { openEmailAddress, openPhoneNumber, openPlayStoreLink } from '@utils/helpers';

import {
  UserManualSectionCard as SectionCard,
  UserManualStepImage as StepImage,
} from '../components';
import { USER_MANUAL_OVERVIEW_STEPS, USER_MANUAL_REGISTRATION_STEPS } from '../utils/guide-steps';

/**
 * Senior-friendly user manual screen for the Pensioner app.
 *
 * Renders a scrollable guide covering registration, photo submission,
 * status checks and support contacts. Opens phone/email/store links via the
 * shared linking helpers ({@link openPhoneNumber}, {@link openEmailAddress},
 * {@link openPlayStoreLink}) and navigates to the privacy policy route on
 * demand.
 *
 * @returns The rendered user manual screen.
 */
export function UserManualScreen() {
  return (
    <SafeAreaView edges={['right', 'left']} className="flex-1">
      <Container>
        <View className="flex-1 gap-5">
          <View className="gap-2">
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
          <View className="gap-4 rounded-md border border-blue-600 bg-blue-50 p-6 ">
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

          {/* 1. Introduction */}
          <SectionCard stepNumber="1" title="What is This App For?">
            <Text className="text-lg font-medium leading-7 text-slate-900">
              Pensioners in Meghalaya no longer need to travel to the Treasury Office in person to
              submit their Life Certificate.
            </Text>
            <Text className="text-lg font-medium leading-7 text-slate-900">
              Using this mobile app on your smartphone, you can complete your liveness verification
              directly from home using your phone&apos;s camera.
            </Text>
            <StepImage
              placeholderText="Main Welcome Home Screen"
              caption="Main app home screen with easy big buttons"
              source={{
                uri: 'https://fastly.picsum.photos/id/690/200/300.jpg?hmac=YX9nONyDZ_zuGZ5wLOen_mxLWVHEsjpkADU43laON4M',
              }}
            />
          </SectionCard>

          {/* 2. Eligibility Note */}
          <SectionCard stepNumber="2" title="Who Can Use This App?">
            <View className="gap-2 rounded-md border border-red-400 bg-red-50 p-5">
              <Text className="text-xl font-black text-red-950">⚠️ ELIGIBILITY CHECK:</Text>
              <Text className="text-lg font-bold leading-7 text-red-900">
                This app is strictly for Pensioners who draw pension through the Meghalaya Treasury
                Office (Treasury PDA).
              </Text>
              <Text className="mt-1 text-base font-semibold text-red-800">
                (Bank pension accounts will be supported in future updates).
              </Text>
            </View>
          </SectionCard>

          {/* 3. Download */}
          <SectionCard stepNumber="3" title="How to Download the App">
            <Text className="text-lg font-medium leading-7 text-slate-900">
              Tap the big green button below to open Google Play Store on your phone:
            </Text>
            <Button size="lg" activeOpacity={0.8} onPress={() => openPlayStoreLink()}>
              ▶ Tap to Download on Play Store
            </Button>
            <StepImage
              placeholderText="Google Play Store App Listing Screen"
              caption="Search for 'Pensioner Life Certificate Meghalaya'"
              source={{
                uri: 'https://fastly.picsum.photos/id/690/200/300.jpg?hmac=YX9nONyDZ_zuGZ5wLOen_mxLWVHEsjpkADU43laON4M',
              }}
            />
          </SectionCard>

          {/* 4. Requirements */}
          <SectionCard stepNumber="4" title="What Your Phone Needs">
            <Text className="text-lg font-bold text-slate-900">
              Make sure your mobile phone has:
            </Text>
            <View className="gap-3 pt-1">
              <View className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text className="text-lg font-black text-blue-900">📷 Front Selfie Camera</Text>
                <Text className="mt-1 text-base font-medium leading-6 text-slate-800">
                  A clear front camera (above 2 Megapixels).
                </Text>
              </View>

              <View className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text className="text-lg font-black text-blue-900">📱 Android Phone</Text>
                <Text className="mt-1 text-base font-medium leading-6 text-slate-800">
                  Android version 5.0 or newer.
                </Text>
              </View>

              <View className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text className="text-lg font-black text-blue-900">🌐 Internet Connection</Text>
                <Text className="mt-1 text-base font-medium leading-6 text-slate-800">
                  Active Mobile Data (SIM internet) or Wi-Fi.
                </Text>
              </View>
            </View>
          </SectionCard>

          {/* 5. Process Overview (Sub-Cards per Step) */}
          <SectionCard stepNumber="5" title="5 Simple Steps to Complete Registration">
            <View className="gap-5">
              {USER_MANUAL_OVERVIEW_STEPS.map((item, index) => (
                <View key={index} className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <View className="self-start rounded-md bg-blue-700 px-3 py-1">
                    <Text className="text-sm font-black text-white">{item.step}</Text>
                  </View>
                  <Text className="mt-2 text-xl font-black text-slate-900">{item.title}</Text>
                  <Text className="mt-1 text-base font-semibold leading-6 text-slate-700">
                    {item.desc}
                  </Text>
                  <StepImage
                    source={{ uri: item.source }}
                    placeholderText={item.placeholder}
                    caption={item.caption}
                  />
                </View>
              ))}
            </View>
          </SectionCard>

          {/* 6. Registration (Clear Detailed Step Cards) */}
          <SectionCard stepNumber="6" title="First Time Registration Steps">
            <View className="gap-6">
              {USER_MANUAL_REGISTRATION_STEPS.map((item) => (
                <View
                  key={item.step}
                  className="gap-2 rounded-md border border-gray-200 bg-gray-50 p-4">
                  <Text className="text-xl font-black text-blue-900">
                    {item.step}: {item.title}
                  </Text>

                  <Text className="text-lg font-medium leading-7 text-slate-900">
                    {item.description}
                  </Text>

                  <StepImage
                    source={{ uri: item.source }}
                    placeholderText={item.placeholder}
                    caption={item.caption}
                  />
                </View>
              ))}

              {/* Family Pensioner Note */}
              <View className="rounded-md border border-amber-500 bg-amber-100 p-5">
                <Text className="text-xl font-black text-amber-950">
                  📌 IMPORTANT NOTE FOR FAMILY PENSIONERS:
                </Text>

                <Text className="mt-2 text-lg font-bold leading-7 text-amber-900">
                  Do NOT enter your own personal Date of Birth!
                </Text>

                <Text className="mt-1 text-base font-medium leading-6 text-amber-900">
                  Please enter the Date of Birth of the original Government Employee who passed
                  away.
                </Text>
              </View>

              {/* Invalid PPO Helpdesk */}
              <View className="gap-3 rounded-md border border-blue-400 bg-blue-50 p-5">
                <Text className="text-xl font-black text-blue-950">
                  Showing &quot;Invalid PPO&quot; Error?
                </Text>

                <Text className="text-base font-semibold leading-6 text-blue-900">
                  Please contact or visit Treasury Helpdesk: Nokrek Building, 3rd Secretariat, Lower
                  Lachumiere, Shillong - 793001
                </Text>

                <Button
                  size="lg"
                  activeOpacity={0.8}
                  onPress={() => openEmailAddress(APP_LINKS.EMAIL.PENSIONER_HELP_DESK)}>
                  ✉️ Email: {APP_LINKS.EMAIL.PENSIONER_HELP_DESK}
                </Button>
              </View>
            </View>
          </SectionCard>
          {/* 7. Submit Photo & Declaration */}
          <SectionCard stepNumber="7" title="Taking Photo & Submitting Form">
            <View className="gap-4">
              <Text className="text-lg font-medium leading-7 text-slate-900">
                <Text className="font-black text-blue-800">1. </Text>
                After logging in, tap the big{' '}
                <Text className="font-black">&quot;Submit Photo&quot;</Text> button.
              </Text>

              <StepImage
                placeholderText="Camera Face Oval Screen"
                caption="Hold phone straight. Keep face inside circle with good room light."
              />

              <Text className="text-lg font-medium leading-7 text-slate-900">
                <Text className="font-black text-blue-800">2. </Text>
                Your photo is submitted automatically to the Treasury Officer.
              </Text>

              <Text className="text-lg font-medium leading-7 text-slate-900">
                <Text className="font-black text-blue-800">3. </Text>
                Complete the two quick Self Declarations:
              </Text>

              <View className="gap-2 rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text className="text-base font-bold leading-6 text-slate-900">
                  • <Text className="font-black text-blue-900">Non-Employment Form:</Text> Required
                  for normal pensioners.
                </Text>
                <Text className="text-base font-bold leading-6 text-slate-900">
                  • <Text className="font-black text-blue-900">Non-Marriage Form:</Text> Required
                  for family pensioners.
                </Text>
              </View>
            </View>
          </SectionCard>

          {/* 8. Check Status */}
          <SectionCard stepNumber="8" title="Checking Your Approval Status">
            <Text className="text-lg font-medium leading-7 text-slate-900">
              You can check if your photo was accepted anytime by tapping{' '}
              <Text className="font-black text-blue-800">&quot;Check Status&quot;</Text> on the home
              screen.
            </Text>
            <StepImage
              placeholderText="Check Verification Status Screen"
              caption="Green tick shows Approved status"
            />
          </SectionCard>

          {/* 9. Change Password */}
          <SectionCard stepNumber="9" title="How to Change Password">
            <Text className="text-lg font-medium leading-7 text-slate-900">
              If you want to choose a new password, select{' '}
              <Text className="font-black text-blue-800">&quot;Change Password&quot;</Text> from the
              app menu.
            </Text>
            <StepImage
              placeholderText="Change Password Screen"
              caption="Type your current password and new password"
            />
          </SectionCard>

          {/* 10. MEDA Chatbot */}
          <SectionCard stepNumber="10" title="Ask MEDA Assistant for Help">
            <Text className="text-lg font-medium leading-7 text-slate-900">
              Need instant answers? Tap{' '}
              <Text className="font-black text-blue-800">MEDA Chatbot</Text> icon to ask questions
              anytime.
            </Text>
            <StepImage
              placeholderText="MEDA Chatbot Screen"
              caption="Tap the chat icon on the bottom corner"
            />
          </SectionCard>

          {/* Bottom Logos */}
          <View className="mt-4 py-6">
            <FooterImg />
          </View>
        </View>
      </Container>
    </SafeAreaView>
  );
}
