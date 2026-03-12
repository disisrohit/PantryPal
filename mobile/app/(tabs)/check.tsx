import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { StockSelector } from '../../components/ui/StockIndicator';
import CategorySection from '../../components/grocery/CategorySection';
import GuestBanner from '../../components/grocery/GuestBanner';
import { usePantryStore } from '../../features/pantry/store';
import { CATEGORY_META } from '../../lib/constants';
import type { StockLevel } from '../../features/pantry/types';

export default function PantryCheckScreen() {
  const {
    items,
    grouped,
    isLoading,
    fetchItems,
    checkEntries,
    updateItemStock,
    guestAdjustment,
    setGuestAdjustment,
    submitPantryCheck,
    resetCheck,
  } = usePantryStore();

  const [submitting, setSubmitting] = useState(false);
  const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);

  useEffect(() => {
    fetchItems();
    resetCheck();
  }, []);

  const categories = Object.keys(grouped).sort((a, b) => {
    const keys = Object.keys(CATEGORY_META);
    return keys.indexOf(a) - keys.indexOf(b);
  });

  const handleSubmit = async () => {
    if (checkEntries.size === 0) {
      Alert.alert('No items checked', 'Please update at least one item\'s stock level');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitPantryCheck();
      Alert.alert(
        'Pantry Check Complete!',
        `Checked ${result.summary.totalChecked} items.\n${result.summary.needsRestock} items need restocking.`,
        [
          { text: 'Generate Order', onPress: () => router.push('/(tabs)/checklist') },
          { text: 'Done', style: 'cancel' },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit check');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50 items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
        <Text className="text-stone-500 mt-3">Loading your pantry...</Text>
      </SafeAreaView>
    );
  }

  const checkedCount = checkEntries.size;
  const totalItems = items.length;

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-2xl font-bold text-stone-800">Pantry Check</Text>
        <Text className="text-sm text-stone-500">
          Update stock levels for each item ({checkedCount}/{totalItems} updated)
        </Text>
      </View>

      {/* Progress bar */}
      <View className="mx-6 mb-3 h-2 bg-stone-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary-500 rounded-full"
          style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
        />
      </View>

      {/* Guest banner */}
      <GuestBanner guestAdjustment={guestAdjustment} onUpdate={setGuestAdjustment} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {categories.map((category) => (
          <CategorySection key={category} category={category}>
            {grouped[category].map((item) => {
              const currentSelection = checkEntries.get(item._id) || null;
              return (
                <View key={item._id} className="py-3 border-b border-stone-100">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-stone-800">{item.name}</Text>
                      <Text className="text-xs text-stone-400">
                        {item.quantity} {item.unit} · Current: {item.currentStock}
                      </Text>
                    </View>
                  </View>
                  <StockSelector
                    selected={currentSelection}
                    onSelect={(stock: StockLevel) => updateItemStock(item._id, stock)}
                  />
                </View>
              );
            })}
          </CategorySection>
        ))}
      </ScrollView>

      {/* Submit button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100">
        <Button
          title={`Submit Check (${checkedCount} items)`}
          onPress={handleSubmit}
          loading={submitting}
          fullWidth
          size="lg"
          disabled={checkedCount === 0}
        />
      </View>
    </SafeAreaView>
  );
}
