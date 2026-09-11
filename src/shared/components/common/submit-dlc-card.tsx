import { Button } from '@components/ui';
import { useSafeNavigation } from '@hooks/use-navigation-lock';
import { PAGE_ROUTES } from '@utils/constants';
import { View, Text } from 'react-native';

export const SubmitDLCCard = () => {
  const navigate = useSafeNavigation();
  return (
    <View className="gap-3 rounded-md border border-border bg-card p-4">
      <View className="flex-row items-center gap-3">
        <Text className="flex-1 text-base font-semibold text-foreground">
          Digital Life Certificate
        </Text>
      </View>

      <Text className="text-center text-base leading-relaxed text-muted-foreground">
        Submit a quick photo to verify your identity and complete your Digital Life Certificate.
      </Text>

      <Button
        size="lg"
        onPress={() => navigate(PAGE_ROUTES.FACE_RECOGNITION)}
        className="flex-row items-center gap-2"
        accessibilityLabel="Open user manual">
        <Text className="text-base font-semibold text-primary-foreground">SUBMIT DLC</Text>
      </Button>
    </View>
  );
};
