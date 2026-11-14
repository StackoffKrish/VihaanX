import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme, useAppStore } from '@mohalla-mart/shared';
export default function TabLayout() {
  const hi = useAppStore((state) => state.language === 'hi');
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: Theme.colors.green, tabBarInactiveTintColor: Theme.colors.muted, tabBarStyle: { backgroundColor: Theme.colors.white, height: 64, paddingBottom: 7, paddingTop: 5 }, tabBarLabelStyle: { fontFamily: hi ? Theme.fonts.hindi : Theme.fonts.english, fontSize: 11 } }}>
      <Tabs.Screen name="index" options={{ title: hi ? 'बैच' : 'Batch', tabBarIcon: ({ color, size }) => <Ionicons name="bicycle" color={color} size={size} /> }} />
      <Tabs.Screen name="map" options={{ title: hi ? 'मैप' : 'Map', tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }} />
      <Tabs.Screen name="earnings" options={{ title: hi ? 'कमाई' : 'Earnings', tabBarIcon: ({ color, size }) => <Ionicons name="cash" color={color} size={size} /> }} />
  </Tabs>;
}
