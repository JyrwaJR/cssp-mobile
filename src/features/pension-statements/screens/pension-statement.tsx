import { Container } from '@components/layout';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PensionStatementScreen = () => {
  const currentYear = new Date().getFullYear();
  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <Container scrollable>
        <View className="gap-2">
          <View className="bg-primary/10 self-start py-1">
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">
              6 Month Statements
            </Text>
          </View>

          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Pensioner Statements
          </Text>

          <Text className="text-sm font-medium text-muted-foreground">{currentYear} Statement</Text>
        </View>
      </Container>
    </SafeAreaView>
  );
};
