import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FooterImg } from '@components/common';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import * as Linking from 'expo-linking';
import { useNetworkStatus } from '@hooks/use-network-status';

import { useInitializeVerification } from '../hooks/use-init-verification';
import { DLCHeader, DLCInstructions, DLCAlerts, DLCActions } from '../components';

/**
 * Renders the "Digital Life Certificate" (DLC) self-verification screen.
 *
 * The screen is the orchestrator for the DLC flow: it owns all hooks and
 * derived state — the front-camera device, camera permission, network status,
 * and the backend initialization/registration status — and delegates the
 * presentational markup to feature components:
 *
 * - {@link DLCHeader} for the screen introduction.
 * - {@link DLCInstructions} for the numbered steps and any status warning.
 * - {@link DLCAlerts} for camera-permission / camera-availability / offline
 *   diagnostics.
 * - {@link DLCActions} for the "Capture Photo" / "Allow Camera Access" /
 *   "Open App Settings" primary action area.
 *
 * The capture button is disabled until the front camera is available and
 * camera permission is granted and the device is online. When the button is
 * activated it routes to the face-recognition flow, passing a registration
 * status param derived from the backend `regStatus` ("02" or "03" require
 * registration). If a non-empty status `msg` is returned by initialization, it
 * is surfaced as a warning banner.
 *
 * @returns The DLC screen wrapped in a safe area and scroll view.
 */
export function DLCScreen() {
  const router = useRouter();
  const frontCamera = useCameraDevice('front');
  const { hasPermission, requestPermission, canRequestPermission } = useCameraPermission();
  const { isOffline } = useNetworkStatus();

  const isDisableCapture = frontCamera === null || !hasPermission;

  const { regStatus, msg } = useInitializeVerification();

  const handleCapturePress = () => {
    const isRegistrationRequired = regStatus === '03' || regStatus === '02';
    router.push({
      pathname: '/face-recognition',
      params: { registrationStatus: isRegistrationRequired ? '1' : '0' },
    });
  };

  const openSettings = async () => await Linking.openSettings();

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      {/* Main Content Area */}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 20 }}
        showsVerticalScrollIndicator={false}>
        {/* Instructions Card */}

        <DLCHeader />

        <DLCInstructions msg={msg} />

        <DLCAlerts
          hasPermission={hasPermission}
          frontCameraAvailable={frontCamera !== null}
          isOffline={isOffline}
        />

        {/* Primary Action Button | Check if camera Permission is granted */}
        {/* Partner Logos */}
        <DLCActions
          hasPermission={hasPermission}
          canRequestPermission={canRequestPermission}
          isDisableCapture={isDisableCapture}
          isOffline={isOffline}
          onCapture={handleCapturePress}
          onRequestPermission={requestPermission}
          onOpenSettings={openSettings}
        />

        <FooterImg />
      </ScrollView>
    </SafeAreaView>
  );
}
