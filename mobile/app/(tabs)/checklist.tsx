import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useShoppingStore } from '../../features/shopping/store';
import { useAuthStore } from '../../features/auth/store';
import { usePantryStore } from '../../features/pantry/store';
import { openInApp, generateShareText, generateWhatsAppText } from '../../features/shopping/deeplinks';
import { SHOPPING_APPS, CATEGORY_META } from '../../lib/constants';
import type { ShoppingItem } from '../../features/shopping/types';

export default function ChecklistScreen() {
  const user = useAuthStore((s) => s.user);
  const { guestAdjustment } = usePantryStore();
  const {
    currentList,
    isGenerating,
    generateList,
    toggleItem,
    markOrdered,
  } = useShoppingStore();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      await generateList(guestAdjustment.enabled ? guestAdjustment : undefined);
    } catch (error: any) {
      if (error?.fullyStocked) {
        Alert.alert('All Stocked! 🎉', error.message);
      } else if (error?.response?.data?.message) {
        Alert.alert('Info', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to generate shopping list. Please try again.');
      }
    }
  };

  const handleOrderOnApp = async (appKey: string, item: ShoppingItem) => {
    try {
      await openInApp(item, appKey);
    } catch {
      Alert.alert('Error', 'Could not open app');
    }
  };

  const handleShareList = async () => {
    if (!currentList) return;
    const text = generateShareText(currentList.items);
    try {
      await Share.share({ message: text });
    } catch {}
  };

  const handleWhatsApp = async () => {
    if (!currentList) return;
    const text = generateWhatsAppText(currentList.items);
    const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to use this feature');
    }
  };

  const preferredApps = user?.household?.preferredApps || [];
  const appOptions = SHOPPING_APPS.filter(
    (app) => preferredApps.length === 0 || preferredApps.includes(app.value)
  );

  const includedItems = currentList?.items.filter((i) => i.included) || [];

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-stone-800">Shopping List</Text>
        <Text className="text-sm text-stone-500">Order items you need</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {!currentList ? (
          <View className="flex-1 items-center justify-center py-20 px-6">
            <Text className="text-5xl mb-4">🛒</Text>
            <Text className="text-lg font-semibold text-stone-700 text-center mb-2">
              Ready to generate your order?
            </Text>
            <Text className="text-sm text-stone-500 text-center mb-6">
              We'll check what's running low and create a shopping list
            </Text>
            <Button
              title="Generate Shopping List"
              onPress={handleGenerate}
              loading={isGenerating}
              size="lg"
            />
          </View>
        ) : (
          <>
            {/* Items list */}
            <View className="px-4">
              {currentList.items.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => toggleItem(currentList._id, item._id)}
                  className={`flex-row items-center py-3 px-3 mb-1 rounded-xl ${
                    item.included ? 'bg-white' : 'bg-stone-100 opacity-50'
                  }`}
                  activeOpacity={0.7}
                >
                  <View
                    className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 ${
                      item.included
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-stone-300'
                    }`}
                  >
                    {item.included && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-base ${
                        item.included
                          ? 'text-stone-800 font-medium'
                          : 'text-stone-400 line-through'
                      }`}
                    >
                      {item.brand ? `${item.brand} ` : ''}{item.name}
                    </Text>
                    <Text className="text-xs text-stone-400">
                      {item.quantity} {item.unit}
                      {item.category ? ` · ${CATEGORY_META[item.category]?.name || item.category}` : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Summary */}
            <View className="px-6 mt-4 mb-4">
              <Text className="text-sm text-stone-500">
                {includedItems.length} of {currentList.items.length} items selected
              </Text>
            </View>

            {/* Order via apps */}
            <View className="px-6 mb-4">
              <Text className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                Order via
              </Text>
              <View className="gap-2">
                {appOptions.map((app) => (
                  <Card key={app.value} padded={false}>
                    <TouchableOpacity
                      className="flex-row items-center px-4 py-3"
                      onPress={() => {
                        if (includedItems.length > 0) {
                          handleOrderOnApp(app.value, includedItems[0]);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text className="text-2xl mr-3">{app.icon}</Text>
                      <Text className="flex-1 text-base font-medium text-stone-800">{app.label}</Text>
                      <Text className="text-primary-500 text-sm font-semibold">Open →</Text>
                    </TouchableOpacity>
                  </Card>
                ))}
              </View>
            </View>

            {/* Share options */}
            <View className="px-6 gap-2">
              <Button
                title="Share List"
                onPress={handleShareList}
                variant="outline"
                fullWidth
              />
              <Button
                title="Send via WhatsApp"
                onPress={handleWhatsApp}
                variant="secondary"
                fullWidth
              />
              <Button
                title="Generate New List"
                onPress={handleGenerate}
                variant="ghost"
                loading={isGenerating}
                fullWidth
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
