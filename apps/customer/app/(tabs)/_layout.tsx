import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme, useAppStore } from '@mohalla-mart/shared';
export default function TabLayout() {
  const hi = useAppStore((state) => state.language === 'hi');
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: Theme.colors.green, tabBarInactiveTintColor: Theme.colors.muted, tabBarStyle: { backgroundColor: Theme.colors.white, height: 64, paddingBottom: 7, paddingTop: 5 }, tabBarLabelStyle: { fontFamily: hi ? Theme.fonts.hindi : Theme.fonts.english, fontSize: 11 } }}>
      <Tabs.Screen name="index" options={{ title: hi ? 'होम' : 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
      <Tabs.Screen name="cart" options={{ title: hi ? 'कार्ट' : 'Cart', tabBarIcon: ({ color, size }) => <Ionicons name="cart" color={color} size={size} /> }} />
      <Tabs.Screen name="map-scan" options={{ title: hi ? 'मैप स्कैन' : 'Map Scan', tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }} />
      <Tabs.Screen name="wallet" options={{ title: hi ? 'वॉलेट' : 'Wallet', tabBarIcon: ({ color, size }) => <Ionicons name="wallet" color={color} size={size} /> }} />
      <Tabs.Screen name="history" options={{ title: hi ? 'इतिहास' : 'History', tabBarIcon: ({ color, size }) => <Ionicons name="time" color={color} size={size} /> }} />
  </Tabs>;
}
