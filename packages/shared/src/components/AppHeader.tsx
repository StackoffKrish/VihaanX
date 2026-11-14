import { Pressable, Text, View } from 'react-native';
import { useAppStore } from '../store';
import { Theme } from '../theme';

export function AppHeader({ showTrust = true }: { showTrust?: boolean }) {
  const { language, toggleLanguage, currentColony } = useAppStore();
  const hi = language === 'hi';
  const fontFamily = hi ? Theme.fonts.hindi : Theme.fonts.english;
  return (
    <View className="px-5 pt-5 pb-3" style={{ backgroundColor: Theme.colors.cream }}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs uppercase tracking-widest text-neutral-500" style={{ fontFamily }}>{hi ? 'आपका मोहल्ला' : 'YOUR NEIGHBOURHOOD'}</Text>
          <Text className="mt-1 text-xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>●  {hi ? 'साकेत' : currentColony.name}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Toggle Hindi and English" onPress={toggleLanguage} className="rounded-full border border-[#0F3D2E] bg-white px-4 py-2">
          <Text className="font-bold text-[#0F3D2E]" style={{ fontFamily }}>हिंदी / EN</Text>
        </Pressable>
      </View>
      {showTrust && <View className="mt-4 rounded-2xl bg-[#0F3D2E] p-4">
        <Text className="text-xs font-bold uppercase tracking-wide text-white" style={{ fontFamily }}>{hi ? 'मोहल्ला ट्रस्ट' : 'MOHALLA TRUST'}</Text>
        <Text className="mt-1 text-lg font-bold text-white" style={{ fontFamily }}>{hi ? '₹1,000 की सीमा' : '₹1,000 limit'}</Text>
        <Text className="mt-1 text-xs text-white" style={{ fontFamily }}>{hi ? 'केवल उदाहरण • कोई वास्तविक क्रेडिट नहीं' : 'Placeholder • no real credit'}</Text>
      </View>}
    </View>
  );
}
