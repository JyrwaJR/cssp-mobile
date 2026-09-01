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
 * One entry of a high-level step-by-step user manual overview, used by the
 * DLC and change-password guides (named after the `USER_MANUAL_*_STEPS`
 * arrays).
 */
interface UserManualDlcStep {
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
 * Step-by-step guide for submitting the annual Digital Life Certificate (DLC),
 * from logging in to completing the submission. Each step's `source` is a
 * temporary existing manual image; replace with the matching screenshot image
 * when it becomes available. `placeholder` documents the screenshot needed.
 */
export const USER_MANUAL_DLC_STEPS: UserManualDlcStep[] = [
  {
    step: 'STEP 1',
    title: 'LOG IN TO YOUR ACCOUNT',
    desc: 'Open the app, enter your PPO Number and Password, then tap the Login button.',
    placeholder: 'Login screen with PPO Number and Password fields',
    caption: 'Enter your PPO Number and Password, then tap Login',
    source: require('@assets/images/manual/login.jpeg'),
  },
  {
    step: 'STEP 2',
    title: 'OPEN THE SUBMIT DLC TAB',
    desc: "At the bottom of the home screen, tap the 'Submit DLC' tab.",
    placeholder: 'Home screen with bottom tabs: Status, Submit DLC, Profile',
    caption: 'Tap the Submit DLC tab at the bottom of the screen',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 3',
    title: 'ALLOW CAMERA ACCESS',
    desc: "If asked, tap the 'Allow Camera Access' button so the app can use your camera. If the button is not shown, camera access is already granted - skip to the next step.",
    placeholder: 'Digital Life Certificate screen with Allow Camera Access button',
    caption: 'Tap the Allow Camera Access button on screen',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 4',
    title: 'TAP CAPTURE PHOTO',
    desc: "On the Digital Life Certificate screen, tap the blue 'Capture Photo' button.",
    placeholder: 'Digital Life Certificate screen with Capture Photo button',
    caption: 'Tap the Capture Photo button',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 5',
    title: 'LOOK INTO THE CAMERA AND BLINK',
    desc: 'Look straight into the camera, keep your face centred, and blink your eyes once. The photo is taken automatically.',
    placeholder: 'Camera screen asking you to blink your eyes',
    caption: 'Look straight and blink your eyes once',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 6',
    title: 'WAIT FOR VERIFICATION',
    desc: 'Wait while the app processes and verifies your photo. Do not close the app.',
    placeholder: 'Loading screen with a "Please wait..." message',
    caption: 'Wait for the check to finish',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 7',
    title: 'ANSWER THE QUESTIONS',
    desc: "If a Self-Declaration form appears, answer the questions. For example, tap 'Yes' or 'No' for 'Are you Re-Employed?' and for 'Are you Re-Married?' if it shows.",
    placeholder: 'Self-Declaration form with Yes / No options',
    caption: 'Tap Yes or No for each question',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 8',
    title: 'TAP SUBMIT',
    desc: "Tap the 'Submit' button on the Self-Declaration form to send your answers.",
    placeholder: 'Self-Declaration form with Submit button',
    caption: 'Tap the Submit button',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 9',
    title: 'CONFIRM THE TERMS',
    desc: "A 'Terms and Conditions' pop-up appears. Tap 'Yes' to confirm and finish submitting.",
    placeholder: 'Terms and Conditions confirmation pop-up',
    caption: 'Tap Yes on the Terms and Conditions pop-up',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
  {
    step: 'STEP 10',
    title: 'SEE YOUR RESULT',
    desc: 'The result screen shows whether your annual Digital Life Certificate was submitted successfully, or if further action is needed.',
    placeholder: 'Verification result screen',
    caption: 'Check your result here',
    source: require('@assets/images/manual/home-screen.jpeg'),
  },
];

export const USER_MANUAL_CHANGE_PASSWORD_STEPS: UserManualDlcStep[] = [
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
