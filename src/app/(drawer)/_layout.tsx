import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Drawer, DrawerContentScrollView, DrawerItem } from 'expo-router/drawer';
import { Button, Icon } from '@components/ui';
import { useAuthStore } from '@stores/auth.store';
import { PAGE_ROUTES } from '@utils/constants';
import { useNavigationLock } from '@hooks/use-navigation-lock';

function CustomDrawerContent(props: any) {
  const { user } = useAuthStore();
  const { logout } = useAuthStore();
  const inset = useSafeAreaInsets();
  const navigate = useNavigationLock();

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="items-center bg-primary p-5 pt-12">
        <View style={{ marginTop: inset.top }} className="items-center gap-3">
          <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white/20">
            <Icon name="user-01" size={32} color="#FFFFFF" />
          </View>
          <View className="items-center">
            <Text className="text-sm font-semibold text-white">{user?.name}</Text>
          </View>
        </View>
      </View>

      {/* Route List */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 12 }}>
        <DrawerItem
          label="Home"
          onPress={() => navigate(PAGE_ROUTES.HOME)}
          pressOpacity={0.1}
          pressColor={'#FFF'}
          icon={({ size, color }) => <Icon name="information-circle" size={size} color={color} />}
        />
        <DrawerItem
          label="Change Password"
          pressOpacity={0.1}
          pressColor={'#FFF'}
          onPress={() => navigate(PAGE_ROUTES.CHANGE_PASSWORD)}
          icon={({ size, color }) => <Icon name="user-unlock" size={size} color={color} />}
        />
        <DrawerItem
          label="Contact Us"
          pressOpacity={0.1}
          pressColor={'#FFF'}
          onPress={() => navigate(PAGE_ROUTES.CONTACT_US)}
          icon={({ size, color }) => <Icon name="contact-01" size={size} color={color} />}
        />
        <DrawerItem
          label="Withdrawal"
          pressOpacity={0.1}
          pressColor={'#FFF'}
          onPress={() => navigate(PAGE_ROUTES.WITHDRAWAL)}
          icon={({ size, color }) => <Icon name="property-delete" size={size} color={color} />}
        />

        <DrawerItem
          label="User Manual"
          pressOpacity={0.1}
          pressColor={'#FFF'}
          onPress={() => navigate(PAGE_ROUTES.USER_MANUAL)}
          icon={({ size, color }) => <Icon name="book-01" size={size} color={color} />}
        />
        <DrawerItem
          label="Privacy Policy"
          onPress={() => navigate(PAGE_ROUTES.PRIVACY)}
          pressOpacity={0.1}
          pressColor={'#FFF'}
          style={{ borderRadius: 6 }}
          icon={({ size, color }) => <Icon name="shield" size={size} color={color} />}
        />
        <DrawerItem
          label="About"
          pressOpacity={0.1}
          pressColor={'#FFF'}
          onPress={() => navigate(PAGE_ROUTES.ABOUT_US)}
          icon={({ size, color }) => <Icon name="info" size={size} color={color} />}
        />
      </DrawerContentScrollView>

      {/* Drawer Footer / Logout */}
      <View className="border-t border-slate-100 p-4">
        <Button size={'lg'} variant={'destructive'} activeOpacity={0.7} onPress={logout}>
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
        swipeEnabled: true,
        headerShown: false,
        drawerActiveBackgroundColor: '#F0FDFA',
        drawerActiveTintColor: '#4297A0',
        drawerInactiveTintColor: '#475569',
        drawerItemStyle: {
          borderRadius: 0,
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
