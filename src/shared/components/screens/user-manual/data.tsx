import React from 'react';
import { Text } from 'react-native';

/**
 * One entry of the detailed first-time registration walkthrough.
 */
interface RegistrationStep {
  /** Badge label shown above the step title (e.g. "Step 1"). */
  step: string;
  /** Short title of the registration step. */
  title: string;
  /** Remote screenshot URL rendered via {@link StepImage}. */
  source: string;
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
  /** Remote screenshot URL rendered via {@link StepImage}. */
  source: string;
}

/** Sample guide image used across all manual screenshots. */
const GUIDE_IMAGE =
  'https://fastly.picsum.photos/id/690/200/300.jpg?hmac=YX9nONyDZ_zuGZ5wLOen_mxLWVHEsjpkADU43laON4M';

/**
 * Detailed first-time registration steps rendered inside section 6 of the
 * user manual screen.
 */
export const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    step: 'Step 1',
    title: 'Tap Register Link',
    source: GUIDE_IMAGE,
    description: (
      <>
        Open the app and tap on{' '}
        <Text className="font-black text-blue-800">&quot;Register / Forgot Password&quot;</Text>{' '}
        text at the bottom.
      </>
    ),
    placeholder: 'Login Screen showing Register button at bottom',
    caption: "Tap the text that says 'Register / Forgot Password'",
  },
  {
    step: 'Step 2',
    title: 'Enter PPO Number',
    source: GUIDE_IMAGE,
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
    source: GUIDE_IMAGE,
    description: (
      <>
        Enter your <Text className="font-black text-slate-900">Date of Birth</Text>, Bank Account
        Number, and create a secret password.
      </>
    ),
    placeholder: 'Registration Form Screen',
    caption: 'Fill in Date of Birth, Bank account, and password',
  },
];

/**
 * High-level five-step process overview rendered inside section 5 of the
 * user manual screen.
 */
export const OVERVIEW_STEPS: OverviewStep[] = [
  {
    step: 'STEP 1',
    title: 'ONE-TIME REGISTRATION',
    desc: 'Register your phone first before trying to log in.',
    placeholder: 'Screen showing Register Button',
    caption: 'Main opening screen where you start registration',
    source: GUIDE_IMAGE,
  },
  {
    step: 'STEP 2',
    title: 'LOG IN TO YOUR ACCOUNT',
    desc: 'Type your PPO Number and Password to log in.',
    placeholder: 'Screen with PPO Box and Password Box',
    caption: 'Log In box screen',
    source: GUIDE_IMAGE,
  },
  {
    step: 'STEP 3',
    title: 'TAKE A FACE PHOTO',
    desc: 'Hold camera in front of your face. Do this once every 6 months.',
    placeholder: 'Camera screen showing face circle',
    caption: 'Position your face inside the circle',
    source: GUIDE_IMAGE,
  },
  {
    step: 'STEP 4',
    title: 'CONFIRM DECLARATION',
    desc: 'Tap YES/NO to confirm your employment or marriage status.',
    placeholder: 'Screen showing Self-Declaration questions',
    caption: 'Simple Yes / No declaration screen',
    source: GUIDE_IMAGE,
  },
  {
    step: 'STEP 5',
    title: 'CHECK YOUR APPROVAL',
    desc: 'See if your photo verification was approved by Treasury.',
    placeholder: 'Screen showing Approved Status tick mark',
    caption: 'Status screen showing green approval tag',
    source: GUIDE_IMAGE,
  },
];
