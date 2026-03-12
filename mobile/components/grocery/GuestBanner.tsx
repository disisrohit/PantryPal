import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import Card from '../ui/Card';
import type { GuestAdjustment } from '../../features/pantry/types';

interface GuestBannerProps {
  guestAdjustment: GuestAdjustment;
  onUpdate: (adjustment: Partial<GuestAdjustment>) => void;
}

const DURATION_OPTIONS = [
  { value: 'next_3_days' as const, label: 'Next 3 days' },
  { value: 'this_week' as const, label: 'This week' },
  { value: 'next_2_weeks' as const, label: '2 weeks' },
];

export default function GuestBanner({ guestAdjustment, onUpdate }: GuestBannerProps) {
  const [expanded, setExpanded] = useState(guestAdjustment.enabled);

  if (!expanded) {
    return (
      <TouchableOpacity
        className="mx-4 mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl flex-row items-center justify-between"
        onPress={() => {
          setExpanded(true);
          onUpdate({ enabled: true, additionalPeople: 2 });
        }}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-lg">👥</Text>
          <Text className="text-sm font-medium text-blue-700">Having guests? Tap to adjust quantities</Text>
        </View>
        <Text className="text-blue-500 text-lg">+</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Card className="mx-4 mb-4 border-blue-200 bg-blue-50">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg">👥</Text>
          <Text className="text-base font-semibold text-blue-800">Guest Mode</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setExpanded(false);
            onUpdate({ enabled: false, additionalPeople: 0 });
          }}
        >
          <Text className="text-blue-500 text-sm font-medium">Remove</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-3">
        <Text className="text-sm text-blue-700 mb-2">
          Extra people: <Text className="font-bold text-blue-900">{guestAdjustment.additionalPeople}</Text>
        </Text>
        <View className="flex-row items-center gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => onUpdate({ additionalPeople: n })}
              className={`w-10 h-10 rounded-full items-center justify-center ${
                guestAdjustment.additionalPeople === n
                  ? 'bg-blue-500'
                  : 'bg-white border border-blue-200'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  guestAdjustment.additionalPeople === n ? 'text-white' : 'text-blue-700'
                }`}
              >
                +{n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text className="text-sm text-blue-700 mb-2">Duration:</Text>
        <View className="flex-row gap-2">
          {DURATION_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onUpdate({ duration: opt.value })}
              className={`px-3 py-1.5 rounded-lg ${
                guestAdjustment.duration === opt.value
                  ? 'bg-blue-500'
                  : 'bg-white border border-blue-200'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  guestAdjustment.duration === opt.value ? 'text-white' : 'text-blue-700'
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Card>
  );
}
