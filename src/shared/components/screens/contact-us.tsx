import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Container } from '@components/layout';
import { FooterImg } from '@components/common';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContactScreenProps {
  isAuthenticated?: boolean;
  onLoginPress?: () => void;
}

export function ContactScreen({ isAuthenticated = true, onLoginPress }: ContactScreenProps) {
  // Direct dial / email handlers
  const handlePhonePress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Container scrollable>
        <View className="w-full gap-5">
          {/* Header Badge */}

          <View className="gap-2">
            <View className="bg-primary/10 self-start py-1">
              <Text className="text-sm font-bold uppercase tracking-wider text-primary">
                Support
              </Text>
            </View>

            <Text className="text-2xl font-extrabold tracking-tight text-foreground">
              Contact Us
            </Text>

            <Text className="text-sm font-medium text-muted-foreground">How can we help you?</Text>
          </View>

          {/* Finance Department Card */}
          <View className="gap-4 rounded-md border border-gray-200 bg-card p-5">
            <View className="items-center border-b border-gray-200 pb-3">
              <Text className="text-center text-base font-bold text-foreground">
                Finance Department
              </Text>
              <Text className="mt-0.5 text-center text-sm font-semibold text-primary">
                Government of Meghalaya
              </Text>
            </View>

            {/* Contact Address */}
            <View className="bg-muted/30 flex-row items-start gap-3 rounded-md border border-gray-200 p-3.5">
              <Feather name="map-pin" size={18} className="mt-0.5" />
              <View className="flex-1">
                <Text className="mb-1 text-sm font-semibold text-foreground">Contact Address</Text>
                <Text className="text-sm leading-5 text-muted-foreground">
                  3rd Secretariat, Nokrek Building,{'\n'}
                  Lower Lachumiere, Meghalaya,{'\n'}
                  Shillong - 793001
                </Text>
              </View>
            </View>

            {/* Land Line No. */}
            <TouchableOpacity
              onPress={() => handlePhonePress('03642226553')}
              activeOpacity={0.7}
              className="bg-muted/30 flex-row items-center gap-3 rounded-md border border-gray-200 p-3.5">
              <Feather name="phone" size={18} />
              <View className="flex-1">
                <Text className="mb-0.5 text-sm font-semibold text-foreground">Land Line No.</Text>
                <Text className="text-sm text-muted-foreground">0364-2226553</Text>
              </View>
            </TouchableOpacity>

            {/* FAX */}
            <View className="bg-muted/30 flex-row items-center gap-3 rounded-md border border-gray-200 p-3.5">
              <Feather name="printer" size={18} />
              <View className="flex-1">
                <Text className="mb-0.5 text-sm font-semibold text-foreground">FAX</Text>
                <Text className="text-sm text-muted-foreground">0364-2226553</Text>
              </View>
            </View>

            {/* Email */}
            <TouchableOpacity
              onPress={() => handleEmailPress('dat-shil-meg@nic.in')}
              activeOpacity={0.7}
              className="bg-muted/30 flex-row items-center gap-3 rounded-md border border-gray-200 p-3.5">
              <Feather name="mail" size={18} />
              <View className="flex-1">
                <Text className="mb-0.5 text-sm font-semibold text-foreground">Email</Text>
                <Text className="text-sm text-muted-foreground">dat-shil-meg@nic.in</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Technical Support Card */}
          <View className="gap-4 rounded-md border border-gray-200 bg-card p-5">
            <View className="items-center border-b border-gray-200 pb-3">
              <Text className="text-center text-base font-bold text-foreground">
                Technical Support
              </Text>
            </View>

            {/* Technical Email */}
            <TouchableOpacity
              onPress={() => handleEmailPress('nongston@nic.in')}
              activeOpacity={0.7}
              className="bg-muted/30 flex-row items-center gap-3 rounded-md border border-gray-200 p-3.5">
              <Feather name="mail" size={18} />
              <View className="flex-1">
                <Text className="mb-0.5 text-sm font-semibold text-foreground">Email</Text>
                <Text className="text-sm text-muted-foreground">nongston@nic.in</Text>
              </View>
            </TouchableOpacity>

            {/* Technical Phone */}
            <TouchableOpacity
              onPress={() => handlePhonePress('9402507046')}
              activeOpacity={0.7}
              className="bg-muted/30 flex-row items-center gap-3 rounded-md border border-gray-200 p-3.5">
              <Feather name="smartphone" size={18} />
              <View className="flex-1">
                <Text className="mb-0.5 text-sm font-semibold text-foreground">Phone Number</Text>
                <Text className="text-sm text-muted-foreground">9402507046</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer Logos */}
          <FooterImg />
        </View>
      </Container>
    </SafeAreaView>
  );
}
