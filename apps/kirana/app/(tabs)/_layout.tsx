import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme, useAppStore } from '@mohalla-mart/shared';
export default function TabLayout() {
  const hi = useAppStore((state) => state.language === 'hi');
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: Theme.colors.green, tabBarInactiveTintColor: Theme.colors.muted, tabBarStyle: { backgroundColor: Theme.colors.white, height: 64, paddingBottom: 7, paddingTop: 5 }, tabBarLabelStyle: { fontFamily: hi ? Theme.fonts.hindi : Theme.fonts.english, fontSize: 11 } }}>
      <Tabs.Screen name="index" options={{ title: hi ? 'आज' : 'Today', tabBarIcon: ({ color, size }) => <Ionicons name="today" color={color} size={size} /> }} />
      <Tabs.Screen name="stock" options={{ title: hi ? 'स्टॉक' : 'Stock', tabBarIcon: ({ color, size }) => <Ionicons name="cube" color={color} size={size} /> }} />
      <Tabs.Screen name="orders" options={{ title: hi ? 'ऑर्डर' : 'Orders', tabBarIcon: ({ color, size }) => <Ionicons name="receipt" color={color} size={size} /> }} />
      <Tabs.Screen name="ledger" options={{ title: hi ? 'खाता' : 'Ledger', tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} /> }} />
      <Tabs.Screen name="vouch" options={{ title: hi ? 'भरोसा' : 'Vouch', tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} /> }} />
  </Tabs>;
}
