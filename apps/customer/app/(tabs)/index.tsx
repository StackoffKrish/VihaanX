import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppHeader, Theme, useAppStore } from '@mohalla-mart/shared';
const products = [
  { name: 'Aashirvaad Atta', hi: 'आशीर्वाद आटा', detail: '1 kg', price: '₹65', icon: '🌾' },
  { name: 'Toor Dal', hi: 'तूर दाल', detail: '1 kg', price: '₹160', icon: '🫘' },
  { name: 'Fresh Milk', hi: 'ताज़ा दूध', detail: '500 ml', price: '₹30', icon: '🥛' },
];
export default function HomeScreen() {
  const hi = useAppStore((s) => s.language === 'hi');
  const fontFamily = hi ? Theme.fonts.hindi : Theme.fonts.english;
  const [message, setMessage] = useState(false);
  return <View className="flex-1 bg-[#FFF8E7]"><ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
    <AppHeader />
    <View className="px-5">
      <Text className="mt-2 text-3xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'होम' : 'Home'}</Text>
      <Text className="mt-1 text-base text-[#667A70]" style={{ fontFamily }}>{hi ? 'आपकी पड़ोस की दुकान, आपके साथ।' : 'Your neighbourhood shop, right here.'}</Text>
      <View className="mt-5 rounded-full border border-[#DCE6DA] bg-white px-5 py-4"><Text className="text-[#667A70]" style={{ fontFamily }}>⌕  {hi ? 'किराना सामान खोजें' : 'Search for groceries'}</Text></View>
      <Text className="mt-6 text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'श्रेणियाँ' : 'Shop by category'}</Text>
      <View className="mt-3 flex-row flex-wrap gap-2">{(hi ? ['आटा दाल', 'रोज़मर्रा की चीज़ें', 'नाश्ता'] : ['Atta Dal', 'Daily Essentials', 'Snacks']).map((category) => <View key={category} className="rounded-full bg-white px-4 py-2"><Text className="text-sm text-[#0F3D2E]" style={{ fontFamily }}>{category}</Text></View>)}</View>
      <Text className="mt-6 text-lg font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'पड़ोस की पसंद' : 'Neighbourhood favourites'}</Text>
      <View className="mt-3 gap-3">{products.map((product) => <View key={product.name} className="flex-row items-center rounded-2xl bg-white p-4">
        <Text className="mr-4 text-3xl">{product.icon}</Text><View className="flex-1"><Text className="font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? product.hi : product.name}</Text><Text className="mt-1 text-sm text-[#667A70]" style={{ fontFamily }}>{product.detail}</Text></View><Text className="text-base font-bold text-[#0F3D2E]" style={{ fontFamily }}>{product.price}</Text>
      </View>)}</View>
      <Pressable accessibilityRole="button" onPress={() => setMessage(true)} className="mt-6 items-center rounded-2xl bg-[#FF6B35] px-5 py-4"><Text className="text-base font-bold text-white" style={{ fontFamily }}>{hi ? 'सामान देखें' : 'Explore groceries'}</Text></Pressable>
      {message && <Text className="mt-3 text-center text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'जल्द आ रहा है!' : 'Coming soon!'}</Text>}
    </View>
  </ScrollView></View>;
}
