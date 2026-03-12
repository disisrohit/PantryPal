import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StockIndicator } from '../ui/StockIndicator';
import type { GroceryItem } from '../../features/pantry/types';

interface GroceryItemRowProps {
  item: GroceryItem;
  onPress?: () => void;
  showStock?: boolean;
  showPrediction?: boolean;
  trailing?: React.ReactNode;
}

export default function GroceryItemRow({
  item,
  onPress,
  showStock = true,
  showPrediction = false,
  trailing,
}: GroceryItemRowProps) {
  const daysLeft = item.predictedEmptyDate
    ? Math.max(0, Math.ceil((new Date(item.predictedEmptyDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <TouchableOpacity
      className="flex-row items-center py-3 px-1"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-medium text-stone-800">{item.name}</Text>
          {item.preferredBrand ? (
            <Text className="text-xs text-stone-400">{item.preferredBrand}</Text>
          ) : null}
        </View>
        <View className="flex-row items-center gap-3 mt-0.5">
          <Text className="text-sm text-stone-500">
            {item.quantity} {item.unit} / {item.frequency}
          </Text>
          {showPrediction && daysLeft !== null && daysLeft <= 7 && (
            <Text className={`text-xs font-medium ${daysLeft <= 2 ? 'text-red-500' : 'text-orange-500'}`}>
              {daysLeft === 0 ? 'Empty!' : `${daysLeft}d left`}
            </Text>
          )}
        </View>
      </View>

      {showStock && (
        <View className="mr-2">
          <StockIndicator stock={item.currentStock} size="sm" />
        </View>
      )}

      {trailing}
    </TouchableOpacity>
  );
}
