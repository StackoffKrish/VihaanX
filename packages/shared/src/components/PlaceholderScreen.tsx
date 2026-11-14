import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppHeader } from './AppHeader';
import { useAppStore } from '../store';
import { Theme } from '../theme';

export function PlaceholderScreen({ title, hindiTitle, description, hindiDescription, action, hindiAction }: {
  title: string; hindiTitle: string; description: string; hindiDescription: string; action: string; hindiAction: string;
}) {
  const hi = useAppStore((s) => s.language === 'hi');
  const [pressed, setPressed] = useState(false);
  const fontFamily = hi ? Theme.fonts.hindi : Theme.fonts.english;
  return <View className="flex-1 bg-[#FFF8E7]"><AppHeader showTrust={false} />
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 36 }}>
      <Text className="text-3xl font-bold text-[#0F3D2E]" style={{ fontFamily }}>{hi ? hindiTitle : title}</Text>
      <View className="mt-5 rounded-2xl bg-white p-5">
        <Text className="text-base leading-6 text-[#17382D]" style={{ fontFamily }}>{hi ? hindiDescription : description}</Text>
        <Text className="mt-3 text-sm text-neutral-500" style={{ fontFamily }}>{hi ? 'यह केवल एक नमूना है।' : 'This is a mock preview.'}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => setPressed(true)} className="mt-6 items-center rounded-2xl bg-[#FF6B35] px-5 py-4">
        <Text className="text-base font-bold text-white" style={{ fontFamily }}>{hi ? hindiAction : action}</Text>
      </Pressable>
      {pressed && <Text accessibilityLiveRegion="polite" className="mt-4 text-center text-[#0F3D2E]" style={{ fontFamily }}>{hi ? 'जल्द आ रहा है!' : 'Coming soon!'}</Text>}
    </ScrollView>
  </View>;
}
