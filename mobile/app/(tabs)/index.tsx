import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { StockIndicator } from '../../components/ui/StockIndicator';
import { useAuthStore } from '../../features/auth/store';
import { usePantryStore } from '../../features/pantry/store';
import type { GroceryItem } from '../../features/pantry/types';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { lowItems, fetchLowItems, fetchItems, items } = usePantryStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchLowItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchItems(), fetchLowItems()]);
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getNextCheckInfo = () => {
    if (!user?.lastPantryCheck) return 'No checks yet — do your first check!';
    const last = new Date(user.lastPantryCheck);
    const daysSince = Math.floor((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
    const schedule = user.pantryCheckSchedule === 'biweekly' ? 14 : 7;
    const daysUntil = schedule - daysSince;
    if (daysUntil <= 0) return 'Pantry check overdue!';
    if (daysUntil === 1) return 'Pantry check tomorrow';
    return `Next check in ${daysUntil} days`;
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-base text-stone-500">{getGreeting()},</Text>
          <Text className="text-2xl font-bold text-stone-800">{firstName}!</Text>
        </View>

        {/* Low Items Alert */}
        {lowItems.length > 0 && (
          <Card className="mx-6 mt-4 border-orange-200 bg-orange-50">
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="text-lg">⚠️</Text>
              <Text className="text-base font-semibold text-orange-800">
                {lowItems.length} item{lowItems.length !== 1 ? 's' : ''} running low
              </Text>
            </View>
            {lowItems.slice(0, 5).map((item: GroceryItem) => {
              const daysLeft = item.predictedEmptyDate
                ? Math.max(0, Math.ceil((new Date(item.predictedEmptyDate).getTime() - Date.now()) / (86400000)))
                : null;
              return (
                <View key={item._id} className="flex-row items-center justify-between py-1.5">
                  <View className="flex-row items-center gap-2">
                    <StockIndicator stock={item.currentStock} size="sm" showLabel={false} />
                    <Text className="text-sm text-stone-700">{item.name}</Text>
                  </View>
                  <Text className="text-xs font-medium text-orange-600">
                    {item.currentStock === 'empty'
                      ? 'Empty!'
                      : daysLeft !== null
                      ? `${daysLeft}d left`
                      : item.currentStock}
                  </Text>
                </View>
              );
            })}
            {lowItems.length > 5 && (
              <Text className="text-xs text-orange-500 mt-1">+{lowItems.length - 5} more</Text>
            )}
          </Card>
        )}

        {/* All Good */}
        {lowItems.length === 0 && items.length > 0 && (
          <Card className="mx-6 mt-4 border-green-200 bg-green-50">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">✅</Text>
              <View>
                <Text className="text-base font-semibold text-green-800">Pantry looks good!</Text>
                <Text className="text-sm text-green-600">All items are stocked</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <View className="px-6 mt-6 gap-3">
          <Text className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-1">Quick Actions</Text>

          <Card onPress={() => router.push('/(tabs)/check')}>
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-primary-100 items-center justify-center">
                <Text className="text-2xl">📋</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-stone-800">Pantry Check</Text>
                <Text className="text-sm text-stone-500">{getNextCheckInfo()}</Text>
              </View>
              <Text className="text-stone-400 text-lg">›</Text>
            </View>
          </Card>

          <Card onPress={() => router.push('/(tabs)/checklist')}>
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-green-100 items-center justify-center">
                <Text className="text-2xl">🛒</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-stone-800">Generate Order</Text>
                <Text className="text-sm text-stone-500">
                  {lowItems.length > 0
                    ? `${lowItems.length} items to order`
                    : 'Create shopping list'}
                </Text>
              </View>
              <Text className="text-stone-400 text-lg">›</Text>
            </View>
          </Card>

          <Card onPress={() => router.push('/(tabs)/pantry')}>
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-blue-100 items-center justify-center">
                <Text className="text-2xl">🏠</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-stone-800">View Pantry</Text>
                <Text className="text-sm text-stone-500">{items.length} items tracked</Text>
              </View>
              <Text className="text-stone-400 text-lg">›</Text>
            </View>
          </Card>
        </View>

        {/* Stats */}
        <View className="px-6 mt-6">
          <Text className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">Overview</Text>
          <View className="flex-row gap-3">
            <Card className="flex-1">
              <Text className="text-2xl font-bold text-stone-800">{items.length}</Text>
              <Text className="text-xs text-stone-500">Total Items</Text>
            </Card>
            <Card className="flex-1">
              <Text className="text-2xl font-bold text-orange-500">{lowItems.length}</Text>
              <Text className="text-xs text-stone-500">Need Restock</Text>
            </Card>
            <Card className="flex-1">
              <Text className="text-2xl font-bold text-green-500">
                {items.filter((i) => i.currentStock === 'full').length}
              </Text>
              <Text className="text-xs text-stone-500">Fully Stocked</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
