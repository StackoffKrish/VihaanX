import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader, Theme, useAppStore } from '@mohalla-mart/shared';

// Step 1 placeholders only: everything below is mock data held in component state.
const orders = [
  { id: 'MM-1041', customer: 'Sharma ji', customerHi: 'शर्मा जी', address: 'A-101, Gulmohar Apartments', addressHi: 'ए-101, गुलमोहर अपार्टमेंट', items: 'Atta 5 kg  •  Toor Dal 1 kg  •  Milk 2', itemsHi: 'आटा 5 किलो  •  तूर दाल 1 किलो  •  दूध 2', total: '₹640' },
  { id: 'MM-1042', customer: 'Mrs. Kapoor', customerHi: 'श्रीमती कपूर', address: 'B-204, Saket Residency', addressHi: 'बी-204, साकेत रेज़िडेंसी', items: 'Rice 5 kg  •  Sugar 1 kg  •  Tea 250 g', itemsHi: 'चावल 5 किलो  •  चीनी 1 किलो  •  चाय 250 ग्राम', total: '₹870' },
  { id: 'MM-1043', customer: 'Verma family', customerHi: 'वर्मा परिवार', address: 'C-302, Neem Court', addressHi: 'सी-302, नीम कोर्ट', items: 'Milk 4  •  Bread 2  •  Eggs 12', itemsHi: 'दूध 4  •  ब्रेड 2  •  अंडे 12', total: '₹290' },
];
const stockItems = [
  { id: 'atta', name: 'Aashirvaad Atta', hi: 'आशीर्वाद आटा', unit: '5 kg bag', unitHi: '5 किलो बैग', icon: '🌾', qty: 12 },
  { id: 'dal', name: 'Toor Dal', hi: 'तूर दाल', unit: '1 kg pack', unitHi: '1 किलो पैक', icon: '🫘', qty: 8 },
  { id: 'milk', name: 'Fresh Milk', hi: 'ताज़ा दूध', unit: '500 ml pouch', unitHi: '500 मि.ली. पाउच', icon: '🥛', qty: 3 },
  { id: 'tea', name: 'Tea', hi: 'चाय', unit: '250 g pack', unitHi: '250 ग्राम पैक', icon: '🍵', qty: 0 },
];
const LOW_STOCK = 3;

export default function TodayScreen() {
  const hi = useAppStore((s) => s.language === 'hi');
  const fontFamily = hi ? Theme.fonts.hindi : Theme.fonts.english;
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [stock, setStock] = useState<Record<string, number>>(() => Object.fromEntries(stockItems.map((item) => [item.id, item.qty])));
  const pending = orders.filter((order) => !accepted[order.id]).length;
  const changeStock = (id: string, delta: number) => setStock((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));

  return (
    <View className="flex-1 bg-[#FFF8E7]">
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <AppHeader showTrust={false} />
        <View className="px-5">
          <Text className="mt-2 text-3xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'आज' : 'Today'}</Text>
          <Text className="mt-1 text-base text-[#667A70]" style={{ fontFamily }}>{hi ? 'आपकी दुकान का एक नज़र में हाल।' : 'Your shop at a glance.'}</Text>

          {/* 1. Three big number cards */}
          <View className="mt-5 flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-[#0F3D2E] p-3">
              <Ionicons name="receipt" size={18} color={Theme.colors.cream} />
              <Text className="mt-2 text-3xl font-bold text-white" style={{ fontFamily }}>12</Text>
              <Text className="mt-1 text-xs text-white" style={{ fontFamily }}>{hi ? 'बैच में ऑर्डर' : 'Orders in batch'}</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white p-3">
              <Ionicons name="cash" size={18} color={Theme.colors.green} />
              <Text className="mt-2 text-2xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>₹2,400</Text>
              <Text className="mt-1 text-xs text-[#667A70]" style={{ fontFamily }}>{hi ? 'आज निपटान' : 'Settled today'}</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white p-3">
              <Ionicons name="time" size={18} color={Theme.colors.orange} />
              <Text className="mt-2 text-2xl font-bold text-[#FF6B35]" style={{ fontFamily }}>₹1,800</Text>
              <Text className="mt-1 text-xs text-[#667A70]" style={{ fontFamily }}>{hi ? 'बाकी उधार' : 'Pending udhar'}</Text>
            </View>
          </View>

          {/* 2. Order cards with a big Accept button */}
          <View className="mt-7 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'नए ऑर्डर' : 'New orders'}</Text>
            <View className="rounded-full bg-white px-3 py-1">
              <Text className="text-xs font-bold text-[#0F3D2E]" style={{ fontFamily }}>{pending} {hi ? 'बाकी' : 'to accept'}</Text>
            </View>
          </View>
          <View className="mt-3 gap-3">
            {orders.map((order) => {
              const isAccepted = Boolean(accepted[order.id]);
              return (
                <View key={order.id} className="rounded-2xl bg-white p-4">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                      <Text className="text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? order.customerHi : order.customer}</Text>
                      <Text className="mt-1 text-sm text-[#667A70]" style={{ fontFamily }}>{hi ? order.addressHi : order.address}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{order.total}</Text>
                      <Text className="mt-1 text-xs text-[#667A70]" style={{ fontFamily }}>#{order.id}</Text>
                    </View>
                  </View>
                  <View className="mt-3 rounded-xl bg-[#FFF8E7] px-3 py-2">
                    <Text className="text-sm leading-5 text-[#17382D]" style={{ fontFamily }}>{hi ? order.itemsHi : order.items}</Text>
                  </View>
                  <View className="mt-3 flex-row">
                    <View className="rounded-full bg-[#E8F1E8] px-3 py-1">
                      <Text className="text-xs font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'बाद में भुगतान' : 'Pay later'}</Text>
                    </View>
                  </View>
                  {isAccepted ? (
                    <View accessibilityLiveRegion="polite" className="mt-4 flex-row items-center justify-center rounded-2xl border border-[#0F3D2E] bg-[#E8F1E8] px-5 py-4">
                      <Ionicons name="checkmark-circle" size={22} color={Theme.colors.green} />
                      <Text className="ml-2 text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'स्वीकार किया' : 'Accepted'}</Text>
                    </View>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${hi ? 'स्वीकार करें' : 'Accept'} ${order.id}`}
                      onPress={() => setAccepted((current) => ({ ...current, [order.id]: true }))}
                      className="mt-4 items-center rounded-2xl bg-[#FF6B35] px-5 py-4"
                    >
                      <Text className="text-lg font-bold text-white" style={{ fontFamily }}>{hi ? 'स्वीकार करें' : 'Accept'}</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>

          {/* 3. Stock list with minus / plus buttons */}
          <Text className="mt-7 text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'स्टॉक' : 'Stock'}</Text>
          <View className="mt-3 rounded-2xl bg-white px-4">
            {stockItems.map((item, index) => {
              const qty = stock[item.id] ?? 0;
              const low = qty <= LOW_STOCK;
              const name = hi ? item.hi : item.name;
              return (
                <View key={item.id} className={index === 0 ? 'flex-row items-center py-4' : 'flex-row items-center border-t border-[#E8F1E8] py-4'}>
                  <Text className="mr-3 text-3xl">{item.icon}</Text>
                  <View className="flex-1 pr-2">
                    <Text className="text-base font-bold text-[#0F3D2E]" style={{ fontFamily }}>{name}</Text>
                    <Text className={low ? 'mt-1 text-sm font-bold text-[#FF6B35]' : 'mt-1 text-sm text-[#667A70]'} style={{ fontFamily }}>
                      {qty === 0 ? (hi ? 'स्टॉक खत्म' : 'Out of stock') : low ? (hi ? 'कम स्टॉक' : 'Low stock') : hi ? item.unitHi : item.unit}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${hi ? 'घटाएँ' : 'Decrease'} ${name}`}
                    disabled={qty === 0}
                    onPress={() => changeStock(item.id, -1)}
                    className={qty === 0 ? 'h-12 w-12 items-center justify-center rounded-full border-2 border-[#0F3D2E] bg-white opacity-30' : 'h-12 w-12 items-center justify-center rounded-full border-2 border-[#0F3D2E] bg-white'}
                  >
                    <Ionicons name="remove" size={24} color={Theme.colors.green} />
                  </Pressable>
                  <Text accessibilityLiveRegion="polite" className="w-12 text-center text-xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{qty}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${hi ? 'बढ़ाएँ' : 'Increase'} ${name}`}
                    onPress={() => changeStock(item.id, 1)}
                    className="h-12 w-12 items-center justify-center rounded-full bg-[#0F3D2E]"
                  >
                    <Ionicons name="add" size={24} color={Theme.colors.white} />
                  </Pressable>
                </View>
              );
            })}
          </View>

          <Text className="mt-5 text-center text-xs text-[#667A70]" style={{ fontFamily }}>{hi ? 'केवल नमूना — कुछ भी सेव या भेजा नहीं जाता।' : 'Mock preview — nothing is saved or sent.'}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
