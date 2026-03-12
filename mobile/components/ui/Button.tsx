import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANTS = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-stone-100 active:bg-stone-200',
  outline: 'bg-transparent border-2 border-primary-500 active:bg-primary-50',
  ghost: 'bg-transparent active:bg-stone-100',
  danger: 'bg-red-500 active:bg-red-600',
};

const TEXT_VARIANTS = {
  primary: 'text-white font-semibold',
  secondary: 'text-stone-800 font-semibold',
  outline: 'text-primary-500 font-semibold',
  ghost: 'text-stone-700 font-medium',
  danger: 'text-white font-semibold',
};

const SIZES = {
  sm: 'px-4 py-2 rounded-lg',
  md: 'px-6 py-3.5 rounded-xl',
  lg: 'px-8 py-4 rounded-2xl',
};

const TEXT_SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${VARIANTS[variant]} ${SIZES[size]} ${
        fullWidth ? 'w-full' : ''
      } ${isDisabled ? 'opacity-50' : ''}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : '#F97316'}
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className={`${TEXT_VARIANTS[variant]} ${TEXT_SIZES[size]}`}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
