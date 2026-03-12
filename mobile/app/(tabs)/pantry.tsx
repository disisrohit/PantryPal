import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategorySection from '../../components/grocery/CategorySection';
import GroceryItemRow from '../../components/grocery/GroceryItemRow';
import { usePantryStore } from '../../features/pantry/store';
import { CATEGORY_META } from '../../lib/constants';

export default function PantryScreen() {
  const { grouped, isLoading, fetchItems } = usePantryStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const categories = Object.keys(grouped).sort((a, b) => {
    const keys = Object.keys(CATEGORY_META);
    return keys.indexOf(a) - keys.indexOf(b);
  });

  if (isLoading && categories.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50 items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-stone-800">My Pantry</Text>
        <Text className="text-sm text-stone-500">All your tracked grocery items</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />}
      >
        {categories.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-4xl mb-3">📦</Text>
            <Text className="text-lg font-semibold text-stone-600">No items yet</Text>
            <Text className="text-sm text-stone-400">Complete onboarding to set up your pantry</Text>
          </View>
        ) : (
          categories.map((category) => (
            <CategorySection key={category} category={category}>
              {grouped[category].map((item) => (
                <GroceryItemRow
                  key={item._id}
                  item={item}
                  showStock
                  showPrediction
                />
              ))}
            </CategorySection>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
