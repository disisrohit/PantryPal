import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../features/auth/store';
import { householdApi } from '../../features/household/api';
import { SHOPPING_APPS } from '../../lib/constants';

export default function AppsSetupScreen() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleApp = (app: string) => {
    setSelectedApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleFinish = async () => {
    if (selectedApps.length === 0) {
      Alert.alert('Select at least one', 'Pick at least one app you order groceries from');
      return;
    }
    setLoading(true);
    try {
      await householdApi.updateHousehold({ preferredApps: selectedApps });
      if (user) {
        updateUser({
          ...user,
          onboardingComplete: true,
          household: { ...user.household, preferredApps: selectedApps },
        });
      }
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-8 mb-8">
          <Text className="text-sm font-semibold text-primary-500 uppercase tracking-widest">Step 3 of 3</Text>
          <Text className="text-2xl font-bold text-stone-800 mt-2">Where do you order?</Text>
          <Text className="text-base text-stone-500 mt-1">
            Pick your preferred grocery apps. We'll link directly to them when you need to order.
          </Text>
        </View>

        <View className="gap-3">
          {SHOPPING_APPS.map((app) => {
            const isSelected = selectedApps.includes(app.value);
            return (
              <TouchableOpacity
                key={app.value}
                onPress={() => toggleApp(app.value)}
                className={`flex-row items-center px-5 py-4 rounded-2xl border-2 ${
                  isSelected ? '' : 'border-stone-200 bg-white'
                }`}
                style={
                  isSelected
                    ? { borderColor: app.color, backgroundColor: app.color + '15' }
                    : {}
                }
                activeOpacity={0.7}
              >
                <Text className="text-2xl mr-4">{app.icon}</Text>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-stone-800">{app.label}</Text>
                </View>
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center ${
                    isSelected ? '' : 'border-2 border-stone-300'
                  }`}
                  style={isSelected ? { backgroundColor: app.color } : {}}
                >
                  {isSelected && <Text className="text-white text-sm font-bold">✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100">
        <Button
          title="All Set — Let's Go!"
          onPress={handleFinish}
          loading={loading}
          fullWidth
          size="lg"
          disabled={selectedApps.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}
