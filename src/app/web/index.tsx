import { Redirect, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function WebScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  if (!uri) return <Redirect href="/" />;

  return <WebView source={{ uri }} style={{ flex: 1 }} />;
}
