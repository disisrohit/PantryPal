import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

const VARIANTS = {
  success: 'bg-green-100',
  warning: 'bg-yellow-100',
  danger: 'bg-red-100',
  info: 'bg-blue-100',
  neutral: 'bg-stone-100',
};

const TEXT_VARIANTS = {
  success: 'text-green-700',
  warning: 'text-yellow-700',
  danger: 'text-red-700',
  info: 'text-blue-700',
  neutral: 'text-stone-700',
};

export default function Badge({ text, variant = 'neutral', size = 'sm' }: BadgeProps) {
  return (
    <View
      className={`${VARIANTS[variant]} ${
        size === 'sm' ? 'px-2.5 py-1 rounded-full' : 'px-3 py-1.5 rounded-lg'
      }`}
    >
      <Text
        className={`${TEXT_VARIANTS[variant]} ${
          size === 'sm' ? 'text-xs' : 'text-sm'
        } font-medium`}
      >
        {text}
      </Text>
    </View>
  );
}
