import React from 'react';
import { Image, ImageSourcePropType, Linking, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FooterImg } from '@components/common';
import { Container } from '@components/layout';
import { Button } from '@components/ui';

// Interface for Section Cards
interface SectionCardProps {
  stepNumber: string;
  title: string;
  children: React.ReactNode;
}

// Interface for Step Images
interface StepImageProps {
  source?: ImageSourcePropType;
  caption?: string;
  placeholderText?: string;
}

/**
 * High-Contrast Image Placeholder / Container for Senior Guidance
 */
const StepImage: React.FC<StepImageProps> = ({
  source,
  caption,
  placeholderText = 'App Screen Guide Placeholder',
}) => (
  <View className="my-3 overflow-hidden rounded-md border border-gray-300 bg-gray-50 ">
    {source ? (
      <Image
        source={source}
        className="resize-contain h-56 w-full bg-white"
        accessibilityLabel={caption || 'Instructional step visual guide'}
      />
    ) : (
      <View className="h-48 w-full items-center justify-center border-b-2 border-dashed border-gray-300 bg-gray-100 p-4">
        <Text className="text-center text-3xl">📱</Text>
        <Text className="mt-2 text-center text-base font-bold text-slate-700">
          {placeholderText}
        </Text>
      </View>
    )}
    {caption && (
      <View className="bg-gray-800 p-3.5">
        <Text className="text-center text-sm font-bold leading-5 text-white">
          💡 Look for this: {caption}
        </Text>
      </View>
    )}
  </View>
);

/**
 * Senior-Friendly Section Card with Large Header Badges & High Contrast
 */
const SectionCard: React.FC<SectionCardProps> = ({ stepNumber, title, children }) => (
  <View className="gap-4 rounded-md border border-gray-300 bg-white p-5 ">
    <View className="flex-row items-center gap-3 border-b-2 border-gray-200 pb-4">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-700">
        <Text className="text-xl font-black text-white">{stepNumber}</Text>
      </View>
      <Text className="flex-1 text-xl font-black tracking-wide text-slate-900">{title}</Text>
    </View>
    <View className="gap-4 pt-1">{children}</View>
  </View>
);

export function UserManualScreen() {
  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePlayStorePress = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.plc.meg');
  };

  const overviewSteps = [
    {
      step: 'STEP 1',
      title: 'ONE-TIME REGISTRATION',
      desc: 'Register your phone first before trying to log in.',
      placeholder: 'Screen showing Register Button',
      caption: 'Main opening screen where you start registration',
      source:
        'https://fastly.picsum.photos/id/690/200/300.jpg?hmac=YX9nONyDZ_zuGZ5wLOen_mxLWVHEsjpkADU43laON4M',
    },
    {
      step: 'STEP 2',
      title: 'LOG IN TO YOUR ACCOUNT',
      desc: 'Type your PPO Number and Password to log in.',
      placeholder: 'Screen with PPO Box and Password Box',
      caption: 'Log In box screen',
      source:
        'https://fastly.picsum.photos/id/690/200/300.jpg?hmac=YX9nONyDZ_zuGZ5wLOen_mxLWVHEsjpkADU43laON4M',
    },
    {
      step: 'STEP 3',
      title: 'TAKE A FACE PHOTO',
      desc: 'Hold camera in front of your face. Do this once every 6 months.',
      placeholder: 'Camera screen showing face circle',
      caption: 'Position your face inside the circle',
      source:
        'https://fastly.picsum.photos/id/690/200/300.jpg?hmac=YX9nONyDZ_zuGZ5wLOen_mxLWVHEsjpkADU43laON4M',
    },
    {
      step: 'STEP 4',
      title: 'CONFIRM DECLARATION',
      desc: 'Tap YES/NO to confirm your employment or marriage status.',
      placeholder: 'Screen showing Self-Declaration questions',
      caption: 'Simple Yes / No declaration screen',
      source:
        'https://fastly.picsum.photos/id/690/200/300.jpg?hmac=YX9nONyDZ_zuGZ5wLOen_mxLWVHEsjpkADU43laON4M',
    },
    {
      step: 'STEP 5',
      title: 'CHECK YOUR APPROVAL',
      desc: 'See if your photo verification was approved by Treasury.',
      placeholder: 'Screen showing Approved Status tick mark',
      caption: 'Status screen showing green approval tag',
      source:
        'https://fastly.picsum.photos/id/690/200/300.jpg?hmac=YX9nONyDZ_zuGZ5wLOen_mxLWVHEsjpkADU43laON4M',
    },
  ];

  return (
    <SafeAreaView edges={['top', 'right', 'left']} className="flex-1">
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
              Easy Step-by-Step Instructions (v1.0.3)
            </Text>
          </View>
          {/* Main Title Hero Card */}
          <View className="gap-4 rounded-md border border-blue-600 bg-blue-50 p-6 ">
            <View className="items-center gap-1.5">
              <Text className="text-xs font-black uppercase tracking-widest text-blue-800">
                Government of Meghalaya • Finance Department
              </Text>
              <Text className="text-center text-3xl font-black text-slate-900">
                Pensioner App User Guide
              </Text>
              <Text className="text-center text-base font-bold text-slate-700">
                Easy Step-by-Step Instructions (v1.0.3)
              </Text>
            </View>

            {/* Emergency Helpline Box */}
            <View className="mt-2 w-full gap-3 rounded-md border border-blue-300 bg-white p-5 ">
              <Text className="text-center text-sm font-black uppercase tracking-wider text-slate-800">
                📞 Need help? Tap a number to call us directly:
              </Text>
              <View className="gap-3">
                <Button
                  size={'lg'}
                  activeOpacity={0.8}
                  onPress={() => handlePhonePress('+918974007873')}>
                  📞 Call +91 8974007873
                </Button>

                <Button
                  size={'lg'}
                  activeOpacity={0.8}
                  onPress={() => handlePhonePress('+919774074202')}>
                  📞 Call +91 9774074202
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
              directly from home using your phone's camera.
            </Text>
            <StepImage
              placeholderText="Main Welcome Home Screen"
              caption="Main app home screen with easy big buttons"
              source={{ uri: 'https://picsum.photos/200/300' }}
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
            <Button size={'lg'} activeOpacity={0.8} onPress={handlePlayStorePress}>
              ▶ Tap to Download on Play Store
            </Button>
            <StepImage
              placeholderText="Google Play Store App Listing Screen"
              caption="Search for 'Pensioner Life Certificate Meghalaya'"
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
          <SectionCard stepNumber="5" title="5 Simple Steps to Complete">
            <View className="gap-5">
              {overviewSteps.map((item, index) => (
                <View key={index} className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <View className="self-start rounded-md bg-blue-700 px-3 py-1">
                    <Text className="text-sm font-black text-white">{item.step}</Text>
                  </View>
                  <Text className="mt-2 text-xl font-black text-slate-900">{item.title}</Text>
                  <Text className="mt-1 text-base font-semibold leading-6 text-slate-700">
                    {item.desc}
                  </Text>
                  <StepImage
                    source={{ uri: `${item.source}?random=${index}` }}
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
              {/* Step 1 */}
              <View className="gap-2 rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text className="text-xl font-black text-blue-900">Step 1: Tap Register Link</Text>
                <Text className="text-lg font-medium leading-7 text-slate-900">
                  Open the app and tap on{' '}
                  <Text className="font-black text-blue-800">"Register / Forgot Password"</Text>{' '}
                  text at the bottom.
                </Text>
                <StepImage
                  placeholderText="Login Screen showing Register button at bottom"
                  caption="Tap the text that says 'Register / Forgot Password'"
                />
              </View>

              {/* Step 2 */}
              <View className="gap-2 rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text className="text-xl font-black text-blue-900">Step 2: Enter PPO Number</Text>
                <Text className="text-lg font-medium leading-7 text-slate-900">
                  Enter your <Text className="font-black text-slate-900">PPO Number</Text> (printed
                  on the front cover of your Pension Passbook).
                </Text>
                <StepImage
                  placeholderText="PPO Number input box screen"
                  caption="Type your PPO number exactly as printed on passbook"
                />
              </View>

              {/* Step 3 */}
              <View className="gap-2 rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text className="text-xl font-black text-blue-900">
                  Step 3: Enter DOB & Bank Account
                </Text>
                <Text className="text-lg font-medium leading-7 text-slate-900">
                  Enter your <Text className="font-black text-slate-900">Date of Birth</Text>, Bank
                  Account Number, and create a secret password.
                </Text>
                <StepImage
                  placeholderText="Registration Form Screen"
                  caption="Fill in Date of Birth, Bank account, and password"
                />
              </View>

              {/* Family Pensioner Highlighted Note */}
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

              {/* Invalid PPO Error Helpdesk */}
              <View className="gap-3 rounded-md border border-blue-400 bg-blue-50 p-5">
                <Text className="text-xl font-black text-blue-950">
                  Showing "Invalid PPO" Error?
                </Text>
                <Text className="text-base font-semibold leading-6 text-blue-900">
                  Please contact or visit Treasury Helpdesk: Nokrek Building, 3rd Secretariat, Lower
                  Lachumiere, Shillong - 793001
                </Text>
                <Button
                  size={'lg'}
                  activeOpacity={0.8}
                  onPress={() => handleEmailPress('pensionhelpdesk2021@gmail.com')}>
                  ✉️ Email: pensionhelpdesk2021@gmail.com
                </Button>
              </View>
            </View>
          </SectionCard>

          {/* 7. Submit Photo & Declaration */}
          <SectionCard stepNumber="7" title="Taking Photo & Submitting Form">
            <View className="gap-4">
              <Text className="text-lg font-medium leading-7 text-slate-900">
                <Text className="font-black text-blue-800">1. </Text>
                After logging in, tap the big <Text className="font-black">
                  "Submit Photo"
                </Text>{' '}
                button.
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
              <Text className="font-black text-blue-800">"Check Status"</Text> on the home screen.
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
              <Text className="font-black text-blue-800">"Change Password"</Text> from the app menu.
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
