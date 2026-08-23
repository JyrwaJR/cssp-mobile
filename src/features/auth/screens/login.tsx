import { View, Text, Image } from 'react-native';
import { LoginForm } from '../components';
import { Container } from '@components/layout';
import { Link } from 'expo-router';
import * as Constants from 'expo-constants';
import { ENDPOINTS } from '@utils/constants/endpoints';
import { NicBanner } from '@components/common/nic-banner';
import { FooterImg } from '@components/common/nic-footer-img';

export function LoginScreen() {
  const appVersion = Constants.default.manifest2?.runtimeVersion || '1.0.0';

  return (
    <>
      <Container centered scrollable dismissKeyboard>
        <View className="w-full items-center gap-6 py-2">
          {/* Top Branding Section */}
          <View className="items-center">
            <Image
              source={require('../../../shared/assets/images/logo-meg.png')}
              className="h-24 w-24"
              resizeMode="contain"
            />

            <View className="mt-3 items-center gap-0.5">
              <Text className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Government of Meghalaya
              </Text>
              <Text className="text-sm font-semibold text-gray-700">Finance Department</Text>
              <Text className="mt-1 text-2xl font-extrabold text-primary">Pensioner Portal</Text>
            </View>
          </View>

          {/* Main Login Form */}
          <View className="w-full">
            <LoginForm />
          </View>

          {/* Registration & Support Actions */}
          <View className="w-full items-center gap-4">
            <Link push href="/auth/reg-instruction" asChild>
              <Text className="text-center text-sm font-semibold text-primary active:opacity-70">
                New User? Register / Update Password
              </Text>
            </Link>

            {/* Secondary Policy & Manual Links */}
            <View className="flex-row items-center justify-center gap-3">
              <Link push href={`/web?uri=${ENDPOINTS.DOCUMENTATION.MANUAL}`} asChild>
                <Text className="text-xs font-semibold text-gray-600 active:opacity-70">
                  User Manual
                </Text>
              </Link>
              <Text className="text-sm text-gray-400">•</Text>
              <Link push href={`/web?uri=${ENDPOINTS.DOCUMENTATION.POLICY}`} asChild>
                <Text className="text-xs font-medium text-gray-500 active:opacity-70">
                  Privacy Policy
                </Text>
              </Link>
            </View>
          </View>

          {/* Partner Logos & Version Footer */}
          <View className="items-center gap-3 pt-2">
            <FooterImg />
            <Text className="text-xs font-medium text-gray-400">Version {appVersion}</Text>
          </View>
        </View>
      </Container>
    </>
  );
}
