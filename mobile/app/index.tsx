import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../features/auth/store';

export default function EntryScreen() {
  const { isLoading, isAuthenticated, user } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 bg-primary-50 items-center justify-center">
        <Text className="text-4xl mb-4">🏠</Text>
        <Text className="text-2xl font-bold text-primary-600 mb-2">PantryPal</Text>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!user?.onboardingComplete) {
    return <Redirect href="/(onboarding)/household" />;
  }

  return <Redirect href="/(tabs)" />;
}
