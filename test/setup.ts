import 'react-native-gesture-handler/jestSetup';
import { setUpTests } from 'react-native-reanimated';

// Registers Gesture Handler's Jest mocks so components relying on
// gesture-handler can mount under Jest without a native runtime.
// (Loaded via `setupFilesAfterEnv` in jest.config.js.)

// Initializes Reanimated's Jest test environment so animations run
// synchronously and deterministically (defaults to 60 fps).
setUpTests();

// Mocks expo-application's native module, which is not available under Jest.
// The mock mirrors the members the codebase consumes: the version/name/id
// constants and the id-lookup helpers used by `use-dlc-submit`.
jest.mock('expo-application', () => ({
  nativeApplicationVersion: '1.0.0',
  nativeBuildVersion: '1',
  applicationName: 'cssp-mobile',
  applicationId: 'com.cssp.mobile',
  getAndroidId: jest.fn(() => ''),
  getIosIdForVendorAsync: jest.fn(async () => null),
  getInstallationTimeAsync: jest.fn(async () => new Date(0)),
}));
