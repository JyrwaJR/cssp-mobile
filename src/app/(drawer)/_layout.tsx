import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Drawer, DrawerContentScrollView, DrawerItem } from 'expo-router/drawer';
import { Button, Icon } from '@components/ui';
import { useAuthStore } from '@stores/auth.store';
import { ENDPOINTS, PAGE_ROUTES } from '@utils/constants';

function CustomDrawerContent(props: any) {
  const { logout } = useAuthStore();
  const inset = useSafeAreaInsets();

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="items-center bg-primary p-5 pt-12">
        <View style={{ marginTop: inset.top }} className="items-center gap-3">
          <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white/20">
            <Icon name="user-01" size={32} color="#FFFFFF" />
          </View>
          <View className="items-center">
            <Text className="text-base font-bold text-white">User Name</Text>
            <Text className="text-xs text-white/80">user@example.com</Text>
          </View>
        </View>
      </View>

      {/* Route List */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 12 }}>
        <DrawerItem
          label="Home"
          onPress={() => router.navigate(PAGE_ROUTES.HOME)}
          icon={({ size, color }) => <Icon name="information-circle" size={size} color={color} />}
        />
        <DrawerItem
          label="Change Password"
          onPress={() => router.navigate(PAGE_ROUTES.CHANGE_PASSWORD)}
          icon={({ size, color }) => <Icon name="user-unlock" size={size} color={color} />}
        />
        <DrawerItem
          label="Contact Us"
          onPress={() => router.navigate(PAGE_ROUTES.CONTACT_US)}
          icon={({ size, color }) => <Icon name="contact-01" size={size} color={color} />}
        />

        <DrawerItem
          label="User Manual"
          onPress={() =>
            router.navigate(`${PAGE_ROUTES.WEB}?uri=${ENDPOINTS.DOCUMENTATION.MANUAL}`)
          }
          icon={({ size, color }) => <Icon name="book-01" size={size} color={color} />}
        />
        <DrawerItem
          label="Privacy Policy"
          onPress={() =>
            router.navigate(`${PAGE_ROUTES.WEB}?uri=${ENDPOINTS.DOCUMENTATION.POLICY}`)
          }
          icon={({ size, color }) => <Icon name="shield" size={size} color={color} />}
        />
        <DrawerItem
          label="About"
          onPress={() => router.navigate(PAGE_ROUTES.ABOUT_US)}
          icon={({ size, color }) => <Icon name="info" size={size} color={color} />}
          activeTintColor="#4297A0"
        />
      </DrawerContentScrollView>

      {/* Drawer Footer / Logout */}
      <View className="border-t border-slate-100 p-4">
        <Button variant={'destructive'} activeOpacity={0.7} onPress={logout}>
          Logout
        </Button>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#F0FDFA',
        drawerActiveTintColor: '#4297A0',
        drawerInactiveTintColor: '#475569',
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 12,
          marginVertical: 2,
        },
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
      }}
    />
  );
}
