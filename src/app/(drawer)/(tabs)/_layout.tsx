import { Icon } from '@components/ui';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();

  const isIOS = Platform.OS === 'ios';

  const tabBarHeight = 64;
  const bottomPadding = isIOS ? Math.max(bottom, 8) : bottom + 8;

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',

        tabBarHideOnKeyboard: true,

        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '700',
          marginTop: 2,
        },

        tabBarIconStyle: {
          marginTop: 2,
        },

        tabBarStyle: {
          height: tabBarHeight + bottomPadding,
          paddingTop: 6,
          paddingBottom: bottomPadding,
          borderTopWidth: Platform.OS === 'android' ? 0.5 : 0,
          elevation: Platform.OS === 'android' ? 8 : 0,
        },

        tabBarItemStyle: {
          paddingVertical: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Status',
          tabBarIcon: ({ size, color }) => (
            <Icon name="information-circle" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="dlc"
        options={{
          title: 'Submit DLC',
          tabBarIcon: ({ size, color }) => <Icon name="camera-01" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <Icon name="user-01" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
