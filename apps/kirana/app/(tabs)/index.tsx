import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppHeader, Theme, useAppStore } from '@mohalla-mart/shared';
export default function TodayScreen() {
  const hi = useAppStore((s) => s.language === 'hi');
  const fontFamily = hi ? Theme.fonts.hindi : Theme.fonts.english;
  const [message, setMessage] = useState(false);
  const stats = [{ label: hi ? 'बैच में ऑर्डर' : 'Orders in batch', value: '12', detail: hi ? 'नमूना ऑर्डर' : 'mock orders' }, { label: hi ? 'आज निपटान' : 'Settled Today', value: '₹2,400', detail: hi ? 'नमूना राशि' : 'mock amount' }, { label: hi ? 'बाकी उधार' : 'Pending Udhar', value: '₹1,800', detail: hi ? 'नमूना राशि' : 'mock amount' }];
  return <View className="flex-1 bg-[#FFF8E7]"><ScrollView contentContainerStyle={{ paddingBottom: 32 }}><AppHeader showTrust={false} />
    <View className="px-5"><Text className="mt-2 text-3xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'आज' : 'Today'}</Text><Text className="mt-1 text-base text-[#667A70]" style={{ fontFamily }}>{hi ? 'आपकी दुकान का एक नज़र में हाल।' : 'Your shop at a glance.'}</Text>
      <View className="mt-5 gap-3">{stats.map((stat) => <View key={stat.label} className="rounded-2xl bg-white p-5"><Text className="text-sm text-[#667A70]" style={{ fontFamily }}>{stat.label}</Text><Text className="mt-2 text-3xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{stat.value}</Text><Text className="mt-1 text-xs text-[#667A70]" style={{ fontFamily }}>{stat.detail}</Text></View>)}</View>
      <Pressable accessibilityRole="button" onPress={() => setMessage(true)} className="mt-6 items-center rounded-2xl bg-[#FF6B35] px-5 py-4"><Text className="text-base font-bold text-white" style={{ fontFamily }}>{hi ? 'आज का बैच देखें' : 'View today’s batch'}</Text></Pressable>
      {message && <Text className="mt-3 text-center text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'जल्द आ रहा है!' : 'Coming soon!'}</Text>}
    </View></ScrollView></View>;
}
