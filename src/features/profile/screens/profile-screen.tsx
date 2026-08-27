import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '@components/layout';
import { Icon } from '@components/ui';
import { useAuthStore } from '@stores/auth.store';
import { PAGE_ROUTES } from '@utils/constants';
import { ProfileFieldRow } from '../components';

/**
 * Read-only profile display screen.
 *
 * Renders the signed-in user's data sourced from `useAuthStore.user` (type
 * `UserT`), including an avatar, and a button that pushes to the
 * `PAGE_ROUTES.PROFILE_UPDATE` route to edit the profile. When no user is
 * present, a fallback message is shown.
 */
export function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <Container scrollable centered>
        <Text className="text-sm font-medium text-muted-foreground">
          No profile data available.
        </Text>
      </Container>
    );
  }

  const fields: { label: string; value: string }[] = [
    { label: 'Name', value: user.name },
    { label: 'Username', value: user.username },
    { label: 'UID', value: user.uid },
    { label: 'PPO No', value: user.ppo_no },
    { label: 'Approval', value: user.approval },
    { label: 'Has DLC', value: user.has_dlc },
    { label: 'Phone No', value: user.phone_no || '—' },
    { label: 'Organization', value: user.organization || '—' },
  ];

  return (
    <Container scrollable>
      <View className="w-full gap-5">
        {/* Avatar */}
        <View className="items-center gap-2 py-2">
          <View className="bg-primary/10 h-20 w-20 items-center justify-center rounded-full">
            <Icon name="user-01" size={40} color="#2563eb" />
          </View>
          <Text className="text-lg font-extrabold text-foreground">{user.name}</Text>
          <Text className="text-sm font-medium text-muted-foreground">@{user.username}</Text>
        </View>

        {/* Field list */}
        <View className="rounded-md border border-gray-200/80 bg-card p-4">
          {fields.map((f) => (
            <ProfileFieldRow key={f.label} label={f.label} value={f.value} />
          ))}
        </View>

        {/* Update action */}
        <Pressable onPress={() => router.push(PAGE_ROUTES.PROFILE_UPDATE)}>
          <View className="border-primary/30 bg-primary/5 flex-row items-center justify-center gap-2 rounded-md border p-3">
            <Icon name="contact-01" size={20} color="#2563eb" />
            <Text className="text-sm font-bold text-primary">Update Profile</Text>
          </View>
        </Pressable>
      </View>
    </Container>
  );
}
