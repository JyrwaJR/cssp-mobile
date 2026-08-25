import { Icon } from '@components/ui';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Status',
          tabBarIcon: ({ size, color }) => (
            <Icon size={size} color={color} name="information-circle" />
          ),
        }}
      />
      <Tabs.Screen
        name="verification"
        options={{
          title: 'Submit Photo',
          tabBarIcon: ({ size, color }) => <Icon size={size} name="camera-01" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Icon name="user-01" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
