import { View } from 'react-native';

import { Ternary } from '@components/common';
import { Alert, AlertTitle, AlertDescription, Icon, Button } from '@components/ui';

/**
 * The props for {@link DLCActions}.
 */
type DLCActionsProps = {
  /** Whether the user has granted camera permission to the app. */
  hasPermission: boolean;
  /** Whether the permission can still be requested (vs. permanently denied). */
  canRequestPermission: boolean;
  /** Whether the capture button should be disabled (no camera or no permission). */
  isDisableCapture: boolean;
  /** Whether the device currently has no network connectivity. */
  isOffline: boolean;
  /** Navigates to the face-recognition flow to capture a photo. */
  onCapture: () => void;
  /** Requests the camera permission from the user. */
  onRequestPermission: () => void;
  /** Opens the system app settings so the user can grant camera access. */
  onOpenSettings: () => void;
};

/**
 * Renders the primary action area of the Digital Life Certificate screen.
 *
 * When the user has granted camera permission, shows a "Capture Photo" button
 * that invokes `onCapture`. Otherwise, if the permission can still be
 * requested, shows a "Camera Access Required" alert with an "Allow Camera
 * Access" button; if the permission is permanently blocked, shows a "Camera
 * Access Blocked" alert with an "Open App Settings" button.
 *
 * @param props - {@link DLCActionsProps}.
 * @returns The Capture Photo button or the permission-granting button group.
 */
export function DLCActions({
  hasPermission,
  canRequestPermission,
  isDisableCapture,
  isOffline,
  onCapture,
  onRequestPermission,
  onOpenSettings,
}: DLCActionsProps) {
  return (
    <Ternary
      condition={hasPermission}
      ifTrue={
        <Button
          disabled={isDisableCapture || isOffline}
          size="lg"
          onPress={onCapture}
          activeOpacity={0.8}>
          Capture Photo
        </Button>
      }
      ifFalse={
        <Ternary
          condition={canRequestPermission}
          ifTrue={
            <>
              <Alert variant="destructive">
                <Icon name="alert-circle" size={18} className="mt-0.5 text-destructive" />

                <View className="flex-1">
                  <AlertTitle className="text-sm">Camera Access Required</AlertTitle>

                  <AlertDescription>
                    Camera access is required to capture a photo. Please grant camera permission to
                    continue.
                  </AlertDescription>
                </View>
              </Alert>

              <Button size="lg" variant="outline" onPress={onRequestPermission} activeOpacity={0.8}>
                Allow Camera Access
              </Button>
            </>
          }
          ifFalse={
            <>
              <Alert variant="destructive">
                <Icon name="alert-circle" size={18} className="mt-0.5 text-destructive" />

                <View className="flex-1">
                  <AlertTitle className="text-sm">Camera Access Blocked</AlertTitle>

                  <AlertDescription>
                    Camera permission has been denied. Please enable camera access in your app
                    settings to continue.
                  </AlertDescription>
                </View>
              </Alert>

              <Button size="lg" variant="outline" onPress={onOpenSettings} activeOpacity={0.8}>
                Open App Settings
              </Button>
            </>
          }
        />
      }
    />
  );
}
