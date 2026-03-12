import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { STOCK_COLORS, STOCK_LABELS, STOCK_ICONS } from '../../lib/theme';
import type { StockLevel } from '../../features/pantry/types';

interface StockIndicatorProps {
  stock: StockLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StockIndicator({ stock, size = 'md', showLabel = true }: StockIndicatorProps) {
  const dotSize = size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <View className="flex-row items-center gap-1.5">
      <View
        className={`${dotSize} rounded-full`}
        style={{ backgroundColor: STOCK_COLORS[stock] }}
      />
      {showLabel && (
        <Text className={`${textSize} font-medium`} style={{ color: STOCK_COLORS[stock] }}>
          {STOCK_LABELS[stock]}
        </Text>
      )}
    </View>
  );
}

interface StockSelectorProps {
  selected: StockLevel | null;
  onSelect: (stock: StockLevel) => void;
  compact?: boolean;
}

const STOCK_OPTIONS: StockLevel[] = ['full', 'half', 'low', 'empty'];

export function StockSelector({ selected, onSelect, compact = false }: StockSelectorProps) {
  return (
    <View className={`flex-row ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {STOCK_OPTIONS.map((stock) => {
        const isSelected = selected === stock;
        return (
          <TouchableOpacity
            key={stock}
            onPress={() => onSelect(stock)}
            className={`${
              compact ? 'px-3 py-2 rounded-lg' : 'px-4 py-2.5 rounded-xl flex-1'
            } items-center justify-center border-2 ${
              isSelected ? 'border-transparent' : 'border-stone-200 bg-white'
            }`}
            style={isSelected ? { backgroundColor: STOCK_COLORS[stock] + '20', borderColor: STOCK_COLORS[stock] } : {}}
            activeOpacity={0.7}
          >
            <Text className={compact ? 'text-base' : 'text-lg'}>{STOCK_ICONS[stock]}</Text>
            {!compact && (
              <Text
                className={`text-xs mt-0.5 font-medium ${
                  isSelected ? '' : 'text-stone-500'
                }`}
                style={isSelected ? { color: STOCK_COLORS[stock] } : {}}
              >
                {STOCK_LABELS[stock]}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
