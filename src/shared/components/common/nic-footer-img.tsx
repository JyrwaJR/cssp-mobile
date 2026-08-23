import { Image, View } from 'react-native';

export const FooterImg = () => {
  return (
    <View className="flex-row items-center justify-center gap-5">
      <Image
        source={require('../../../shared/assets/images/NIC.png')}
        className="h-14 w-28"
        resizeMode="contain"
      />
      <View className="h-5 w-[1px] bg-gray-200" />
      <Image
        source={require('../../../shared/assets/images/Digital-India.png')}
        className="h-14 w-28"
        resizeMode="contain"
      />
    </View>
  );
};
