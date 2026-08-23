import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Tabs',
          drawerLabel: 'Tabs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
