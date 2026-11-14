import '../global.css';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter';
import { NotoSansDevanagari_400Regular } from '@expo-google-fonts/noto-sans-devanagari';
import { Theme } from '@mohalla-mart/shared';
import { Text, View } from 'react-native';

const queryClient = new QueryClient();
export default function RootLayout() {
  const [loaded, error] = useFonts({ Inter_400Regular, NotoSansDevanagari_400Regular });
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: Theme.colors.cream }} />;
  if (error) return <View><Text>Unable to load fonts.</Text></View>;
  return <QueryClientProvider client={queryClient}><Stack screenOptions={{ headerShown: false }} /></QueryClientProvider>;
}
