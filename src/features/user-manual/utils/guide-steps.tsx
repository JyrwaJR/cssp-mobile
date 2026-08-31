import React from 'react';
import { type ImageSourcePropType, Text } from 'react-native';

/**
 * One entry of the detailed first-time registration walkthrough.
 */
interface RegistrationStep {
  /** Badge label shown above the step title (e.g. "Step 1"). */
  step: string;
  /** Short title of the registration step. */
  title: string;
  /** Image source (local require or remote URI) rendered via {@link StepImage}. */
  source: ImageSourcePropType;
  /** Rich-text instruction body (may contain styled `<Text>` spans). */
  description: React.ReactNode;
  /** Placeholder text shown if the image cannot be resolved. */
  placeholder: string;
  /** Caption hint displayed under the image. */
  caption: string;
}

/**
 * One entry of the high-level five-step process overview.
 */
interface OverviewStep {
  /** Badge label shown in the blue pill (e.g. "STEP 1"). */
  step: string;
  /** Uppercase title of the overview step. */
  title: string;
  /** Plain-text summary sentence for the step. */
  desc: string;
  /** Placeholder text shown if the image cannot be resolved. */
  placeholder: string;
  /** Caption hint displayed under the image. */
  caption: string;
  /** Image source (local require or remote URI) rendered via {@link StepImage}. */
  source: ImageSourcePropType;
}

/**
 * Detailed first-time registration steps rendered inside section 6 of the
 * user manual screen.
 */
export const USER_GETTING_STARTED_STEPS: RegistrationStep[] = [
  {
    step: 'Step 1',
    title: 'Tap Register Link',
    source: require('@assets/images/manual/login.jpeg'),
    description: (
      <>
        Open the app and tap on{' '}
        <Text className="font-black text-blue-800">&quot;Register / Forgot Password&quot;</Text>{' '}
        Button at the bottom.
      </>
    ),
    placeholder: 'Login Screen showing Register button at bottom',
    caption: "Tap the text that says 'Register / Forgot Password'",
  },
  {
    step: 'Step 2',
    title: 'Enter PPO Number',
    source: require('@assets/images/manual/reg-1.jpeg'),
    description: (
      <>
        Enter your <Text className="font-black text-slate-900">PPO Number</Text> (printed on the
        front cover of your Pension Passbook).
      </>
    ),
    placeholder: 'PPO Number input box screen',
    caption: 'Type your PPO number exactly as printed on passbook',
  },
  {
    step: 'Step 3',
    title: 'Enter DOB & Bank Account',
    source: require('@assets/images/manual/reg-2.jpeg'),
    description: (
      <>
        Enter your <Text className="font-black text-slate-900">Date of Birth</Text>, &nbsp;
        <Text className="font-black text-slate-900">Bank Account Number</Text>.
      </>
    ),
    placeholder: 'Registration Form Screen',
    caption: 'Fill in Date of Birth, Bank account, and password',
  },
  {
    step: 'Step 4',
    title: 'Enter Login Password',
    source: require('@assets/images/manual/reg-3.jpeg'),
    description: (
      <>
        Enter your <Text className="font-black text-slate-900">Password</Text>, then re-enter it in{' '}
        <Text className="font-black text-slate-900">Confirm Password</Text>.
      </>
    ),
    placeholder: 'Password Form Screen',
    caption: 'Fill in Password and Confirm password',
  },
  {
    step: 'Step 5',
    title: 'Confirmation Screen',
    source: require('@assets/images/manual/reg-4.jpeg'),
    description: (
      <>
        Review all your details on the confirmation screen, then tap{' '}
        <Text className="font-black text-blue-800">&quot;Submit&quot;</Text> to complete
        registration.
      </>
    ),
    placeholder: 'Confirmation Screen',
    caption: 'Confirm your details before submitting',
  },
];

/**
 * High-level five-step process overview rendered inside section 5 of the
 * user manual screen.
 */
export const USER_MANUAL_DLC_STEPS: OverviewStep[] = [
  {
    step: 'STEP 1',
    title: 'ONE-TIME REGISTRATION',
    desc: 'Register your phone first before trying to log in.',
    placeholder: 'Screen showing Register Button',
    caption: 'Main opening screen where you start registration',
    source: require('@assets/images/manual/login.jpeg'),
  },
  {
    step: 'STEP 2',
    title: 'LOG IN TO YOUR ACCOUNT',
    desc: 'Type your PPO Number and Password to log in.',
    placeholder: 'Screen with PPO Box and Password Box',
    caption: 'Log In box screen',
    source: require('@assets/images/manual/login.jpeg'),
  },
  {
    step: 'STEP 3',
    title: 'TAKE A FACE PHOTO',
    desc: 'Hold camera in front of your face. Do this once every 6 months.',
    placeholder: 'Camera screen showing face circle',
    caption: 'Position your face inside the circle',
    source: require('@assets/images/manual/login.jpeg'),
  },
  {
    step: 'STEP 4',
    title: 'CONFIRM DECLARATION',
    desc: 'Tap YES/NO to confirm your employment or marriage status.',
    placeholder: 'Screen showing Self-Declaration questions',
    caption: 'Simple Yes / No declaration screen',
    source: require('@assets/images/manual/login.jpeg'),
  },
  {
    step: 'STEP 5',
    title: 'CHECK YOUR APPROVAL',
    desc: 'See if your photo verification was approved by Treasury.',
    placeholder: 'Screen showing Approved Status tick mark',
    caption: 'Status screen showing green approval tag',
    source: require('@assets/images/manual/login.jpeg'),
  },
];

export const USER_MANUAL_CHANGE_PASSWORD_STEPS: OverviewStep[] = [
  {
    step: 'STEP 1',
    title: 'LOG IN TO YOUR ACCOUNT',
    desc: 'Type your PPO Number and Password to log in.',
    placeholder: 'Screen with PPO Box and Password Box',
    caption: 'Log In box screen',
    source: require('@assets/images/manual/login.jpeg'),
  },
  {
    step: 'STEP 2',
    title: 'OPEN THE DRAWER MENU',
    desc: 'Open the App drawer menu to select Change Password.',
    placeholder: 'Click the drawer menu icon',
    caption: 'Click the drawer menu icon',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 3',
    title: 'CLICK ON CHANGE PASSWORD',
    desc: 'Tap on the "Change Password" option from the drawer menu.',
    placeholder: 'Drawer menu showing Change Password option',
    caption: "Select 'Change Password' from the menu",
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 4',
    title: 'FILL IN YOUR OLD & NEW PASSWORD',
    desc: 'Enter your current password, then type your new password and confirm it.',
    placeholder: 'Change Password form with old and new password fields',
    caption: 'Fill in all password fields and tap Submit',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
];
