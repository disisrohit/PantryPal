import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../features/auth/store';
import { CUISINE_OPTIONS, DIET_OPTIONS, SHOPPING_APPS } from '../../lib/constants';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  const cuisineLabel = CUISINE_OPTIONS.find((c) => c.value === user?.household?.cuisinePreference)?.label || 'Not set';
  const dietLabel = DIET_OPTIONS.find((d) => d.value === user?.household?.dietaryPreference)?.label || 'Not set';
  const preferredAppLabels = (user?.household?.preferredApps || [])
    .map((a) => SHOPPING_APPS.find((s) => s.value === a)?.label || a)
    .join(', ') || 'None selected';

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 pt-4 pb-6">
          <Text className="text-2xl font-bold text-stone-800">Profile</Text>
        </View>

        {/* User Info */}
        <Card className="mx-6 mb-4">
          <View className="items-center py-2">
            <View className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center mb-3">
              <Text className="text-3xl">👤</Text>
            </View>
            <Text className="text-xl font-bold text-stone-800">{user?.name}</Text>
            <Text className="text-sm text-stone-500">{user?.phone}</Text>
          </View>
        </Card>

        {/* Household */}
        <View className="px-6 mb-2">
          <Text className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Household</Text>
        </View>
        <Card className="mx-6 mb-4">
          <ProfileRow label="Adults" value={String(user?.household?.adultsCount || 0)} />
          <ProfileRow label="Kids" value={String(user?.household?.kidsCount || 0)} />
          <ProfileRow label="Cuisine" value={cuisineLabel} />
          <ProfileRow label="Diet" value={dietLabel} />
        </Card>

        {/* Preferences */}
        <View className="px-6 mb-2">
          <Text className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Preferences</Text>
        </View>
        <Card className="mx-6 mb-4">
          <ProfileRow label="Pantry Check" value={user?.pantryCheckSchedule || 'weekly'} />
          <ProfileRow label="Check Day" value={user?.pantryCheckDay || 'sunday'} />
          <ProfileRow label="Shopping Apps" value={preferredAppLabels} />
        </Card>

        {/* Actions */}
        <View className="px-6 mt-4 gap-3">
          <Button
            title="Edit Household Settings"
            onPress={() => router.push('/(onboarding)/household')}
            variant="outline"
            fullWidth
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            fullWidth
          />
        </View>

        <Text className="text-center text-xs text-stone-400 mt-6">PantryPal v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2.5 border-b border-stone-50">
      <Text className="text-sm text-stone-500">{label}</Text>
      <Text className="text-sm font-medium text-stone-800">{value}</Text>
    </View>
  );
}
