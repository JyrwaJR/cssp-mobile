import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { FooterImg } from '@components/common';
import { APP_LINKS, APP_VERSION, PAGE_ROUTES } from '@utils/constants';
import { Container } from '@components/layout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openEmailAddress, openPhoneNumber, openPlayStoreLink } from '@utils/helpers';

interface SectionCardProps {
  id?: string;
  stepNumber: string;
  title: string;
  children: React.ReactNode;
}

// Reusable Section Card Component
const SectionCard: React.FC<SectionCardProps> = ({ stepNumber, title, children }) => (
  <View className="gap-2.5 rounded-md border border-border bg-card p-4 shadow-sm">
    <View className="flex-row items-center gap-2 border-b border-border pb-2">
      <View className="bg-primary/10 h-6 w-6 items-center justify-center rounded-full">
        <Text className="text-sm font-bold text-primary">{stepNumber}</Text>
      </View>
      <Text className="flex-1 text-sm font-bold uppercase text-foreground">{title}</Text>
    </View>
    <View className="gap-2 pt-1">{children}</View>
  </View>
);

export function UserManualScreen() {
  const tocItems = [
    '1. INTRODUCTION',
    '2. WHO CAN USE THIS APP?',
    '3. HOW TO DOWNLOAD THIS APP?',
    '4. MINIMUM REQUIREMENTS',
    '5. PROCESS OVERVIEW',
    '6. REGISTRATION',
    '7. SUBMIT PHOTO (FACE VERIFICATION)',
    '8. CHECK STATUS',
    '9. CHANGE YOUR PERSONAL PASSWORD',
    '10. MEDA (CHATBOT)',
  ];

  return (
    <SafeAreaView>
      <Container>
        <View className="flex-1 gap-5">
          {/* Main Title Hero Card */}
          <View className="gap-2">
            <View className="bg-primary/10 self-start py-1">
              <Text className="text-sm font-bold uppercase tracking-wider text-primary">
                Support
              </Text>
            </View>

            <Text className="text-2xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </Text>

            <Text className="text-sm font-medium text-muted-foreground">
              {`Pensioner's`} Life Certificate Verification App
            </Text>
          </View>
          <View className="border-primary/30 bg-primary/10 items-center gap-3 rounded-md border p-4">
            <Text className="text-center text-lg font-bold text-foreground">
              User Manual {APP_VERSION}
            </Text>
            <View className="items-center">
              <Text className="text-center text-sm font-semibold text-muted-foreground">
                Finance Department
              </Text>
              <Text className="text-center text-sm font-bold text-primary">
                Government of Meghalaya
              </Text>
            </View>

            {/* Helpline Contacts */}
            <View className="border-primary/20 bg-background/60 mt-1 w-full items-center gap-1 rounded-md border p-3">
              <Text className="text-[10px] font-bold uppercase text-muted-foreground">
                Contact Helpline
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={() => openPhoneNumber(APP_LINKS.PHONE.HELP_LINE_1)}>
                  <Text className="text-sm font-bold text-primary underline">
                    {APP_LINKS.PHONE.HELP_LINE_1}
                  </Text>
                </TouchableOpacity>
                <Text className="text-sm text-muted-foreground">|</Text>
                <TouchableOpacity onPress={() => openPhoneNumber(APP_LINKS.PHONE.HELP_LINE_2)}>
                  <Text className="text-sm font-bold text-primary underline">
                    {APP_LINKS.PHONE.HELP_LINE_2}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Links */}
            <TouchableOpacity onPress={() => router.push(PAGE_ROUTES.PRIVACY)} className="mt-1">
              <Text className="text-sm font-bold text-primary underline">View Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          {/* Table of Contents */}
          <View className="gap-2.5 rounded-md border border-border bg-card p-4 shadow-sm">
            <Text className="border-b border-border pb-2 text-sm font-bold uppercase text-primary">
              Contents Overview
            </Text>
            <View className="gap-1.5 pt-1">
              {tocItems.map((item, idx) => (
                <Text key={idx} className="text-sm font-medium text-card-foreground">
                  {item}
                </Text>
              ))}
            </View>
          </View>

          {/* 1. Introduction */}
          <SectionCard stepNumber="1" title="Introduction">
            <Text className="text-justify text-sm leading-5 text-muted-foreground">
              In Meghalaya, the traditional system requires pensioners to visit their nearest
              Treasury Office for identity verification via fingerprint or paper records. This poses
              a challenge, particularly for senior citizens living in rural areas.
            </Text>
            <Text className="text-justify text-sm leading-5 text-card-foreground">
              {`The Pensioner's`} Life Certificate Verification mobile app offers an easy,
              hassle-free interface to verify liveness using Face Verification and AI. Additionally,
              pensioners can submit Self Declarations for Non-Employment / Non-Marriage and track
              status directly within the app.
            </Text>
          </SectionCard>

          {/* 2. Who Can Use This App? */}
          <SectionCard stepNumber="2" title="Who Can Use This App?">
            <View className="rounded-md border border-red-200 bg-red-50 p-3">
              <Text className="text-justify text-sm font-bold leading-5 text-red-700">
                This mobile app is applicable ONLY to Pensioners of the Government of Meghalaya
                (Treasury PDA).
              </Text>
              <Text className="mt-1 text-justify text-sm text-red-600">
                Services may be extended to Bank PDAs in future releases.
              </Text>
            </View>
          </SectionCard>

          {/* 3. How to Download */}
          <SectionCard stepNumber="3" title="How to Download This App?">
            <Text className="text-sm leading-5 text-muted-foreground">
              You can download the official Android app directly from Google Play Store:
            </Text>
            <TouchableOpacity
              onPress={openPlayStoreLink}
              className="bg-primary/10 border-primary/30 mt-1 items-center rounded-md border p-3">
              <Text className="text-sm font-bold text-primary underline">
                Open Google Play Store Page
              </Text>
            </TouchableOpacity>
          </SectionCard>

          {/* 4. Minimum Requirements */}
          <SectionCard stepNumber="4" title="Minimum Requirements">
            <Text className="text-sm leading-5 text-muted-foreground">
              Ensure your smartphone meets the following prerequisites:
            </Text>
            <View className="gap-2 pl-1 pt-1">
              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">(i) Camera: </Text>
                Front camera ({'>'}2 MP). Only front camera is supported for enhanced security.
              </Text>
              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">(ii) Operating System: </Text>
                Android Version 5.0 or higher.
              </Text>
              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">(iii) Connectivity: </Text>
                Active internet connection (Mobile Data / Wi-Fi).
              </Text>
            </View>
          </SectionCard>

          {/* 5. Process Overview */}
          <SectionCard stepNumber="5" title="Process Overview">
            <View className="gap-2.5">
              <View className="gap-1 border-b border-border pb-2">
                <Text className="text-sm font-bold text-primary">STEP 1. REGISTRATION</Text>
                <Text className="text-sm leading-5 text-muted-foreground">
                  Complete your one-time registration before logging in.
                </Text>
              </View>

              <View className="gap-1 border-b border-border pb-2">
                <Text className="text-sm font-bold text-primary">STEP 2. LOG IN</Text>
                <Text className="text-sm leading-5 text-muted-foreground">
                  Log in using your PPO No. and the password created during registration.
                </Text>
              </View>

              <View className="gap-1 border-b border-border pb-2">
                <Text className="text-sm font-bold text-primary">
                  STEP 3. SUBMIT PHOTO (FACE VERIFICATION)
                </Text>
                <Text className="text-sm leading-5 text-muted-foreground">
                  Submit photo for initial approval. Face verification is required twice a calendar
                  year (every 6 months).
                </Text>
              </View>

              <View className="gap-1 border-b border-border pb-2">
                <Text className="text-sm font-bold text-primary">
                  STEP 4. SUBMIT SELF DECLARATION
                </Text>
                <Text className="text-sm leading-5 text-muted-foreground">
                  Submit declarations for Non-Employment and Non-Marriage.
                </Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-bold text-primary">STEP 5. CHECK STATUS</Text>
                <Text className="text-sm leading-5 text-muted-foreground">
                  Track the verification status anytime from the home screen.
                </Text>
              </View>
            </View>
          </SectionCard>

          {/* 6. Registration */}
          <SectionCard stepNumber="6" title="Registration Steps">
            <View className="gap-2">
              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">1. </Text>
                Click on <Text className="font-bold">{`"Register / Forgot Password"`}</Text> on the
                login page.
              </Text>

              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">2. </Text>
                Enter your <Text className="font-bold">PPO No.</Text> (found on your Pension
                Passbook front page).
              </Text>

              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">3. </Text>
                Enter <Text className="font-bold">Date of Birth</Text> (DD-MM-YYYY format), enter
                Bank Account Number, and set a new password.
              </Text>
            </View>

            {/* Note for Family Pensioner */}
            <View className="mt-2 rounded-md border border-amber-300 bg-amber-50 p-3">
              <Text className="text-justify text-sm leading-5 text-amber-950">
                <Text className="font-bold">Note for Family Pensioners: </Text>
                Do NOT enter your personal Date of Birth. Enter the Date of Birth of the deceased
                Government Employee under whom pension is claimed.
              </Text>
            </View>

            {/* Invalid PPO Helpdesk */}
            <View className="bg-muted/40 mt-2 gap-1 rounded-md border border-border p-3">
              <Text className="text-sm font-bold text-foreground">Facing invalid PPO errors?</Text>
              <Text className="text-sm text-muted-foreground">
                Address: 3rd Secretariat, Nokrek Building, Lower Lachumiere, Shillong - 793001
              </Text>
              <TouchableOpacity
                onPress={() => openEmailAddress(APP_LINKS.EMAIL.PENSIONER_HELP_DESK)}
                activeOpacity={0.7}>
                <Text className="mt-1 text-sm font-bold text-primary underline">
                  Email: {APP_LINKS.EMAIL.PENSIONER_HELP_DESK}
                </Text>
              </TouchableOpacity>
            </View>
          </SectionCard>

          {/* 7. Submit Photo / Self Declaration */}
          <SectionCard stepNumber="7" title="Submit Photo & Self Declaration">
            <View className="gap-2">
              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">(i) </Text>
                Click <Text className="font-bold">{`"Submit Photo"`}</Text> after log in.
              </Text>

              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">(ii) </Text>
                Your photo will be sent to the Treasury Office for verification. Check image clarity
                before submitting.
              </Text>

              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">(iii) </Text>
                Once approved, proceed with Self Declarations:
              </Text>

              <View className="gap-1 pl-3">
                <Text className="text-sm leading-5 text-muted-foreground">
                  •{' '}
                  <Text className="font-bold text-foreground">Non-Employment / Re-Employment:</Text>{' '}
                  Required for standard pensioners.
                </Text>
                <Text className="text-sm leading-5 text-muted-foreground">
                  • <Text className="font-bold text-foreground">Re-Marriage / Non-Marriage:</Text>{' '}
                  Required for family pensioners.
                </Text>
              </View>

              <Text className="text-sm leading-5 text-card-foreground">
                <Text className="font-bold text-primary">(iv) </Text>
                If rejected by the department, you will need to re-submit a clear photo.
              </Text>
            </View>
          </SectionCard>

          {/* 8. Check Status */}
          <SectionCard stepNumber="8" title="Check Status">
            <Text className="text-sm leading-5 text-card-foreground">
              You can track your submitted photo status or view details of your latest Face
              Verification anytime by tapping{' '}
              <Text className="font-bold text-primary">{`"Check Status"`}</Text> from the main home
              dashboard.
            </Text>
          </SectionCard>

          {/* 9. Change Password */}
          <SectionCard stepNumber="9" title="Change Personal Password">
            <Text className="text-sm leading-5 text-card-foreground">
              To update your current password, select{' '}
              <Text className="font-bold text-primary">{`"Change Password"`}</Text> from the home
              screen.
            </Text>
            <Text className="mt-1 text-sm leading-5 text-muted-foreground">
              If you have forgotten your password, tap {`"Register / Forgot Password"`} on the login
              screen and follow the verification steps.
            </Text>
          </SectionCard>

          {/* 10. MEDA (Chatbot) */}
          <SectionCard stepNumber="10" title="MEDA Chatbot Assistance">
            <Text className="text-sm leading-5 text-card-foreground">
              Have questions or need instant support? Use{' '}
              <Text className="font-bold text-primary">MEDA</Text>, your virtual assistant built
              inside the app to assist with common queries and troubleshooting.
            </Text>
          </SectionCard>

          {/* Bottom Logos */}
          <View className="mt-auto py-8">
            <FooterImg />
          </View>
        </View>
      </Container>
    </SafeAreaView>
  );
}
