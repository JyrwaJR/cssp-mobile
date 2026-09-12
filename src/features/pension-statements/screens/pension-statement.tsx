import { RefreshControl } from 'react-native';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container, PaginatedList } from '@components/layout';
import { usePensionerStatement } from '../hooks';
import { PensionerStatementListItem } from '../components';
import type { PensionerStatement } from '../types';
import { Button } from '@components/ui';
import { PAGE_ROUTES } from '@utils/constants';
import { Ternary } from '@components/common';
import { useSafeNavigation } from '@hooks/use-safe-navigation';
import { usePdfPreviewStore } from '@stores/pdf-preview';

/**
 * Screen displaying pensioner statements for the current year.
 *
 * Uses the usePensionerStatement hook to fetch statement data,
 * rendered as an expandable FlatList via PaginatedList. Shows a
 * clear empty state when no statements are available.
 */

export const PensionStatementScreen = () => {
  const currentYear = new Date().getFullYear();
  const { data: statements, isLoading, refetch, isFetching } = usePensionerStatement();
  const uri = statements?.base64;
  const setPdf = usePdfPreviewStore((s) => s.setPdf);
  const navigate = useSafeNavigation();

  const onPressPreview = () => {
    if (!uri) return;
    setPdf(uri);
    navigate(PAGE_ROUTES.PDF_PREVIEW);
  };

  return (
    <Container
      scrollable={false}
      className="px-6 pt-6"
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}>
      <SafeAreaView className="flex-1" edges={['left', 'right']}>
        {/* Header */}
        <View className="gap-2 pb-2">
          <View className="self-start bg-primary-foreground py-1">
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">
              6 Month Statements
            </Text>
          </View>

          <Text className="text-2xl font-extrabold tracking-tight text-foreground">
            Pensioner Statements
          </Text>

          <Text className="text-sm font-medium text-muted-foreground">{currentYear} Statement</Text>
        </View>

        {/* Statement List */}
        <PaginatedList
          data={statements?.data}
          isLoading={isLoading}
          isRefreshing={isFetching && !isLoading}
          onRefresh={refetch}
          skeletonCount={4}
          skeletonHeight={140}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => (
            <PensionerStatementListItem statement={item as PensionerStatement} />
          )}
          contentContainerStyle={{ gap: 12 }}
          ListEmptyComponent={
            !isLoading ? (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-sm font-medium text-muted-foreground">
                  No pension statements found for this year.
                </Text>
              </View>
            ) : undefined
          }
        />
      </SafeAreaView>
      <Ternary
        condition={!uri}
        ifTrue={null}
        ifFalse={
          <View className="absolute bottom-0 left-0 right-0 h-16 flex-1 flex-row items-center justify-between border-t border-secondary-foreground bg-background px-2">
            <View className="">
              <Text className="text-lg font-semibold tracking-wider text-secondary-foreground">
                PDF is available
              </Text>
            </View>
            <View>
              <Button onPress={onPressPreview} size={'default'}>
                Preview / Download
              </Button>
            </View>
          </View>
        }
      />
    </Container>
  );
};
