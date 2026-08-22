import { memo, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoutePath } from '@hooks/use-route-path';
import { matchPageHeader, cn } from '@utils/helpers';
import { Icon } from '@components/ui/icon';

export const StackHeader = memo(() => {
  const path = useRoutePath();
  const config = useMemo(() => matchPageHeader(path), [path]);
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();

  const handleBack = useCallback(() => router.back(), [router]);

  if (!config) return null;

  const showBack = config.showBackButton && canGoBack;

  const showDrawer = config.showDrawer;

  const showPlaceHolder = showBack || showDrawer;
  return (
    <>
      <View className={cn('border-b border-gray-200')} style={{ paddingTop: insets.top }}>
        <View className="min-h-[56px] flex-row items-center justify-between gap-x-3 p-3">
          <View className="flex-row items-center justify-start">
            {showDrawer ? (
              <TouchableOpacity
                // onPress={() => navigation.openDrawer()}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                activeOpacity={0.7}>
                <Text>D</Text>
              </TouchableOpacity>
            ) : (
              showBack && (
                <TouchableOpacity
                  onPress={handleBack}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                  activeOpacity={0.7}>
                  <Icon name="arrow-left" size={26} />
                </TouchableOpacity>
              )
            )}
          </View>

          <View className="w-full flex-[4] items-center justify-center">
            <Text className="text-xl font-bold leading-loose tracking-widest text-black">
              {config.title}
            </Text>
          </View>

          {showPlaceHolder && <View className="flex-1 flex-row items-center justify-end" />}
        </View>

        {config.bottomContent && <View className="px-4 pb-3">{config.bottomContent}</View>}
      </View>
    </>
  );
});

StackHeader.displayName = 'StackHeader';
