import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppHeader, Theme, useAppStore } from '@mohalla-mart/shared';
const stops = [
  { building: 'Gulmohar Apartments', flat: 'A-101', gate: '1024' },
  { building: 'Saket Residency', flat: 'B-204', gate: '2468' },
  { building: 'Neem Court', flat: 'C-302', gate: '1357' },
  { building: 'Garden Heights', flat: 'D-405', gate: '9876' },
];
export default function BatchScreen() {
  const hi = useAppStore((s) => s.language === 'hi');
  const fontFamily = hi ? Theme.fonts.hindi : Theme.fonts.english;
  const [delivered, setDelivered] = useState(false);
  return <View className="flex-1 bg-[#FFF8E7]"><ScrollView contentContainerStyle={{ paddingBottom: 32 }}><AppHeader showTrust={false} />
    <View className="px-5"><Text className="mt-2 text-3xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'बैच' : 'Batch'}</Text><Text className="mt-1 text-base text-[#667A70]" style={{ fontFamily }}>{hi ? 'आज के 4 नमूना स्टॉप' : '4 mock stops for today'}</Text>
      <View className="mt-5 gap-3">{stops.map((stop, i) => <View key={stop.flat} className="flex-row rounded-2xl bg-white p-4"><View className="mr-4 h-9 w-9 items-center justify-center rounded-full bg-[#E8F1E8]"><Text className="font-bold text-[#0F3D2E]">{i + 1}</Text></View><View className="flex-1"><Text className="text-base font-bold text-[#0F3D2E]" style={{ fontFamily }}>{stop.building}</Text><Text className="mt-1 text-sm text-[#667A70]" style={{ fontFamily }}>{hi ? 'फ्लैट' : 'Flat'} {stop.flat}  •  {hi ? 'गेट कोड' : 'Gate code'} {stop.gate}</Text></View></View>)}</View>
      <Pressable accessibilityRole="button" onPress={() => setDelivered(true)} className="mt-6 items-center rounded-2xl bg-[#FF6B35] px-5 py-4"><Text className="text-base font-bold text-white" style={{ fontFamily }}>{hi ? 'डिलीवर किया' : 'Delivered'}</Text></Pressable>
      {delivered && <Text accessibilityLiveRegion="polite" className="mt-3 text-center text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'केवल नमूना — कोई डिलीवरी अपडेट नहीं हुई।' : 'Mock only — no delivery was updated.'}</Text>}
    </View></ScrollView></View>;
}
