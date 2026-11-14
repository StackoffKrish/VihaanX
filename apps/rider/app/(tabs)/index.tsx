import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader, Theme, useAppStore } from '@mohalla-mart/shared';

// Step 1 placeholders only: mock stops held in component state, no map service.
const stops = [
  { id: 'stop-1', building: 'Gulmohar Apartments', buildingHi: 'गुलमोहर अपार्टमेंट', flat: 'A-101', gate: '1024', left: '12%', top: '14%' },
  { id: 'stop-2', building: 'Saket Residency', buildingHi: 'साकेत रेज़िडेंसी', flat: 'B-204', gate: '2468', left: '40%', top: '46%' },
  { id: 'stop-3', building: 'Neem Court', buildingHi: 'नीम कोर्ट', flat: 'C-302', gate: '1357', left: '76%', top: '18%' },
  { id: 'stop-4', building: 'Garden Heights', buildingHi: 'गार्डन हाइट्स', flat: 'D-405', gate: '9876', left: '80%', top: '62%' },
] as const;

export default function BatchScreen() {
  const hi = useAppStore((s) => s.language === 'hi');
  const fontFamily = hi ? Theme.fonts.hindi : Theme.fonts.english;
  const [delivered, setDelivered] = useState<Record<string, boolean>>({});
  const deliveredCount = stops.filter((stop) => delivered[stop.id]).length;

  return (
    <View className="flex-1 bg-[#FFF8E7]">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <AppHeader showTrust={false} />
        <View className="px-5">
          <Text className="mt-2 text-3xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'बैच' : 'Batch'}</Text>
          <Text className="mt-1 text-base text-[#667A70]" style={{ fontFamily }}>{hi ? 'आज के 4 नमूना स्टॉप' : '4 mock stops for today'}</Text>

          {/* 1. Map placeholder card (drawn with plain views, no map service) */}
          <View className="mt-5 overflow-hidden rounded-2xl bg-white">
            <View className="h-44 bg-[#E8F1E8]">
              <View className="absolute left-0 right-0 h-3 bg-white" style={{ top: '34%' }} />
              <View className="absolute left-0 right-0 h-3 bg-white" style={{ top: '78%' }} />
              <View className="absolute bottom-0 top-0 w-3 bg-white" style={{ left: '30%' }} />
              <View className="absolute bottom-0 top-0 w-3 bg-white" style={{ left: '66%' }} />
              {stops.map((stop, index) => {
                const done = Boolean(delivered[stop.id]);
                return (
                  <View
                    key={stop.id}
                    className={done ? 'absolute h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#0F3D2E]' : 'absolute h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#FF6B35]'}
                    style={{ left: stop.left, top: stop.top }}
                  >
                    {done ? <Ionicons name="checkmark" size={18} color={Theme.colors.white} /> : <Text className="text-sm font-bold text-white" style={{ fontFamily }}>{index + 1}</Text>}
                  </View>
                );
              })}
              <View className="absolute bottom-3 left-3 flex-row items-center rounded-full bg-white px-3 py-1">
                <Ionicons name="map" size={14} color={Theme.colors.green} />
                <Text className="ml-2 text-xs font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'नमूना मैप' : 'Map placeholder'}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between bg-[#0F3D2E] px-4 py-3">
              <View className="flex-1 pr-3">
                <Text className="text-base font-bold text-white" style={{ fontFamily }}>{hi ? 'साकेत रूट  •  4 स्टॉप' : 'Saket route  •  4 stops'}</Text>
                <Text className="mt-1 text-xs text-white" style={{ fontFamily }}>{hi ? 'मैप सेवा जुड़ी नहीं है' : 'Map service not connected'}</Text>
              </View>
              <View className="items-end">
                <Text accessibilityLiveRegion="polite" className="text-2xl font-bold text-white" style={{ fontFamily }}>{deliveredCount}/{stops.length}</Text>
                <Text className="text-xs text-white" style={{ fontFamily }}>{hi ? 'डिलीवर' : 'delivered'}</Text>
              </View>
            </View>
          </View>

          {/* 2. Four stop cards: building, flat, gate code, big Delivered button */}
          <Text className="mt-7 text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'स्टॉप' : 'Stops'}</Text>
          <View className="mt-3 gap-3">
            {stops.map((stop, index) => {
              const done = Boolean(delivered[stop.id]);
              const building = hi ? stop.buildingHi : stop.building;
              return (
                <View key={stop.id} className="rounded-2xl bg-white p-4">
                  <View className="flex-row items-center">
                    <View className={done ? 'mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#0F3D2E]' : 'mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#E8F1E8]'}>
                      {done ? <Ionicons name="checkmark" size={20} color={Theme.colors.white} /> : <Text className="text-base font-bold text-[#0F3D2E]" style={{ fontFamily }}>{index + 1}</Text>}
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs uppercase tracking-wide text-[#667A70]" style={{ fontFamily }}>{hi ? 'बिल्डिंग' : 'Building'}</Text>
                      <Text className="text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{building}</Text>
                    </View>
                  </View>
                  <View className="mt-3 flex-row gap-3">
                    <View className="flex-1 rounded-xl bg-[#FFF8E7] p-3">
                      <Text className="text-xs uppercase tracking-wide text-[#667A70]" style={{ fontFamily }}>{hi ? 'फ्लैट' : 'Flat'}</Text>
                      <Text className="mt-1 text-xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{stop.flat}</Text>
                    </View>
                    <View className="flex-1 rounded-xl bg-[#FFF8E7] p-3">
                      <Text className="text-xs uppercase tracking-wide text-[#667A70]" style={{ fontFamily }}>{hi ? 'गेट कोड' : 'Gate code'}</Text>
                      <Text className="mt-1 text-xl font-bold tracking-widest text-[#0F3D2E]" style={{ fontFamily }}>{stop.gate}</Text>
                    </View>
                  </View>
                  {done ? (
                    <View accessibilityLiveRegion="polite" className="mt-4 flex-row items-center justify-center rounded-2xl border border-[#0F3D2E] bg-[#E8F1E8] px-5 py-4">
                      <Ionicons name="checkmark-circle" size={22} color={Theme.colors.green} />
                      <Text className="ml-2 text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'डिलीवर हो गया' : 'Delivered'}</Text>
                    </View>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${hi ? 'डिलीवर किया' : 'Mark delivered'}: ${building}, ${stop.flat}`}
                      onPress={() => setDelivered((current) => ({ ...current, [stop.id]: true }))}
                      className="mt-4 items-center rounded-2xl bg-[#FF6B35] px-5 py-4"
                    >
                      <Text className="text-lg font-bold text-white" style={{ fontFamily }}>{hi ? 'डिलीवर किया' : 'Delivered'}</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>

          <Text className="mt-5 text-center text-xs text-[#667A70]" style={{ fontFamily }}>{hi ? 'केवल नमूना — कोई डिलीवरी अपडेट नहीं होती।' : 'Mock preview — no delivery is updated.'}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
