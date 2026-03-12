import React from 'react';
import { View, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  padded?: boolean;
}

export default function Card({ children, className = '', onPress, padded = true }: CardProps) {
  const baseClass = `bg-white rounded-2xl shadow-sm border border-stone-100 ${
    padded ? 'p-4' : ''
  } ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity className={baseClass} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View className={baseClass}>{children}</View>;
}
