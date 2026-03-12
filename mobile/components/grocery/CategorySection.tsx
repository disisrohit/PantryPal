import React from 'react';
import { View, Text } from 'react-native';
import { CATEGORY_META } from '../../lib/constants';
import type { GroceryItem } from '../../features/pantry/types';

interface CategorySectionProps {
  category: string;
  children: React.ReactNode;
}

export default function CategorySection({ category, children }: CategorySectionProps) {
  const meta = CATEGORY_META[category] || { name: category, icon: '📦' };

  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl mb-1">
        <Text className="text-lg">{meta.icon}</Text>
        <Text className="text-sm font-semibold text-stone-600 uppercase tracking-wide">
          {meta.name}
        </Text>
      </View>
      <View className="px-3">{children}</View>
    </View>
  );
}
