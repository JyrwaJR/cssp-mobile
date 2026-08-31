import { View, Text, Image } from 'react-native';
import { Link, router } from 'expo-router';

import { LoginForm } from '../components';
import { Button } from '@components/ui/button';
import { Container } from '@components/layout';
import { FooterImg } from '@components/common/nic-footer-img';
import { PAGE_ROUTES } from '@utils/constants/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_VERSION } from '@utils/constants';

/**
 * Login screen for the Pensioner Portal.
 *
 * Senior-friendly layout: large-print branding hierarchy, a prominent
 * full-width outline button as the registration entry point (56px tall),
 * and >=16px secondary links with generous touch padding. Theme tokens
 * keep every text tier legible in dark mode.
 *
 * @returns The rendered login screen.
 */
export function LoginScreen() {
  return (
    <SafeAreaView className="flex-1">
      <Container centered scrollable dismissKeyboard>
        <View className="w-full items-center gap-6 py-2">
          {/* Top Branding Section */}
          <View className="items-center">
            <Image
              source={require('../../../shared/assets/images/logo-meg.png')}
              className="h-24 w-24"
              resizeMode="contain"
            />

            <View className="mt-3 items-center gap-1">
              <Text className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Government of Meghalaya
              </Text>
              <Text className="text-base font-semibold text-foreground">Finance Department</Text>
              <Text className="mt-1 text-2xl font-extrabold text-primary">Pensioner Portal</Text>
            </View>
          </View>

          {/* Main Login Form */}
          <View className="w-full">
            <LoginForm />
          </View>

          {/* Registration & Support Actions */}
          <View className="w-full items-center gap-5">
            {/* Primary entry point for new users — full-width, 56px target */}
            <Button
              variant="outline"
              size="lg"
              onPress={() => router.push(PAGE_ROUTES.AUTH.REG_INSTRUCTION)}
              className="w-full">
              <Text className="text-center text-base font-bold text-primary">
                New User? Register / Forgot Password
              </Text>
            </Button>

            {/* Secondary Policy & Manual Links */}
            <View className="flex-row items-center justify-center gap-4">
              <Link
                push
                href={PAGE_ROUTES.USER_MANUAL}
                className="py-2 text-base font-semibold text-muted-foreground active:opacity-70">
                User Manual
              </Link>
              <Text className="text-base text-muted-foreground">•</Text>
              <Link
                push
                href={PAGE_ROUTES.PRIVACY}
                className="py-2 text-base font-semibold text-muted-foreground active:opacity-70">
                Privacy Policy
              </Link>
            </View>
          </View>

          {/* Partner Logos & Version Footer */}
          <View className="items-center gap-3 pt-2">
            <FooterImg />
            <Text className="text-sm font-medium text-muted-foreground">Version {APP_VERSION}</Text>
          </View>
        </View>
      </Container>
    </SafeAreaView>
  );
}
