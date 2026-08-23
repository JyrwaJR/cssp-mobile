import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Status',
        }}
      />
      <Tabs.Screen
        name="photo"
        options={{
          title: 'Submit Photo',
        }}
      />
      <Tabs.Screen
        name="withdrawal"
        options={{
          title: 'Withdrawal',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
