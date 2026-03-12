import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import CategorySection from '../../components/grocery/CategorySection';
import { pantryApi } from '../../features/pantry/api';
import { CATEGORY_META, FREQUENCY_OPTIONS } from '../../lib/constants';
import type { GroceryTemplate, TemplateItem } from '../../features/pantry/types';

export default function GrocerySetupScreen() {
  const [templates, setTemplates] = useState<GroceryTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<GroceryTemplate | null>(null);
  const [excludedItems, setExcludedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { templates: data } = await pantryApi.getTemplates();
      setTemplates(data);
      if (data.length > 0) setSelectedTemplate(data[0]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (itemName: string) => {
    const next = new Set(excludedItems);
    if (next.has(itemName)) {
      next.delete(itemName);
    } else {
      next.add(itemName);
    }
    setExcludedItems(next);
  };

  const handleApply = async () => {
    if (!selectedTemplate) return;
    setApplying(true);
    try {
      const customizations = selectedTemplate.items
        .filter((item) => excludedItems.has(item.name))
        .map((item) => ({ name: item.name, isActive: false }));

      await pantryApi.applyTemplate(selectedTemplate._id, customizations);
      router.push('/(onboarding)/apps');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to apply template');
    } finally {
      setApplying(false);
    }
  };

  // Group items by category
  const groupedItems: Record<string, TemplateItem[]> = {};
  if (selectedTemplate) {
    selectedTemplate.items.forEach((item) => {
      if (!groupedItems[item.category]) groupedItems[item.category] = [];
      groupedItems[item.category].push(item);
    });
  }

  const categories = Object.keys(groupedItems).sort((a, b) => {
    const aOrder = CATEGORY_META[a] ? Object.keys(CATEGORY_META).indexOf(a) : 99;
    const bOrder = CATEGORY_META[b] ? Object.keys(CATEGORY_META).indexOf(b) : 99;
    return aOrder - bOrder;
  });

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-stone-500 mt-3">Loading your personalized grocery list...</Text>
      </SafeAreaView>
    );
  }

  const activeCount = selectedTemplate
    ? selectedTemplate.items.length - excludedItems.size
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 mt-6 mb-4">
          <Text className="text-sm font-semibold text-primary-500 uppercase tracking-widest">Step 2 of 3</Text>
          <Text className="text-2xl font-bold text-stone-800 mt-2">Your Grocery List</Text>
          <Text className="text-base text-stone-500 mt-1">
            We've pre-filled {selectedTemplate?.items.length} items based on your preferences. Tap to remove items you don't need.
          </Text>
        </View>

        {/* Template selector (if multiple) */}
        {templates.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-4">
            <View className="flex-row gap-2">
              {templates.map((t) => (
                <TouchableOpacity
                  key={t._id}
                  onPress={() => {
                    setSelectedTemplate(t);
                    setExcludedItems(new Set());
                  }}
                  className={`px-4 py-2 rounded-xl ${
                    selectedTemplate?._id === t._id
                      ? 'bg-primary-500'
                      : 'bg-stone-100'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedTemplate?._id === t._id ? 'text-white' : 'text-stone-600'
                    }`}
                  >
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Items by category */}
        {categories.map((category) => (
          <CategorySection key={category} category={category}>
            {groupedItems[category].map((item) => {
              const excluded = excludedItems.has(item.name);
              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => toggleItem(item.name)}
                  className={`flex-row items-center py-3 px-2 rounded-lg ${
                    excluded ? 'opacity-40' : ''
                  }`}
                  activeOpacity={0.7}
                >
                  <View className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 ${
                    excluded ? 'border-stone-300 bg-stone-100' : 'border-primary-500 bg-primary-500'
                  }`}>
                    {!excluded && <Text className="text-white text-xs font-bold">✓</Text>}
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base ${excluded ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                      {item.name}
                    </Text>
                    <Text className="text-xs text-stone-400">
                      {item.quantity} {item.unit} · {item.defaultFrequency}
                      {item.commonBrands && item.commonBrands.length > 0 ? ` · ${item.commonBrands[0]}` : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </CategorySection>
        ))}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100">
        <Text className="text-center text-sm text-stone-500 mb-2">
          {activeCount} items selected (you can always edit later)
        </Text>
        <Button title="Next — Choose Shopping Apps" onPress={handleApply} loading={applying} fullWidth size="lg" />
      </View>
    </SafeAreaView>
  );
}
