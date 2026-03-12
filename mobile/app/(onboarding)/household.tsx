import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../features/auth/store';
import { householdApi } from '../../features/household/api';
import { CUISINE_OPTIONS, DIET_OPTIONS } from '../../lib/constants';

export default function HouseholdSetupScreen() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [cuisine, setCuisine] = useState('pan_indian');
  const [diet, setDiet] = useState('vegetarian');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setLoading(true);
    try {
      await householdApi.updateHousehold({
        adultsCount: adults,
        kidsCount: kids,
        cuisinePreference: cuisine,
        dietaryPreference: diet,
      });
      if (user) {
        updateUser({
          ...user,
          household: {
            ...user.household,
            adultsCount: adults,
            kidsCount: kids,
            cuisinePreference: cuisine,
            dietaryPreference: diet,
          },
        });
      }
      router.push('/(onboarding)/grocery-setup');
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
          <Text className="text-sm font-semibold text-primary-500 uppercase tracking-widest">Step 1 of 3</Text>
          <Text className="text-2xl font-bold text-stone-800 mt-2">Tell us about your household</Text>
          <Text className="text-base text-stone-500 mt-1">We'll customize your grocery list based on this</Text>
        </View>

        {/* People Count */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-stone-700 mb-3">How many people eat at home?</Text>

          <View className="mb-4">
            <Text className="text-sm text-stone-500 mb-2">Adults: <Text className="font-bold text-stone-800">{adults}</Text></Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setAdults(n)}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    adults === n ? 'bg-primary-500' : 'bg-stone-100'
                  }`}
                >
                  <Text className={`font-semibold ${adults === n ? 'text-white' : 'text-stone-600'}`}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm text-stone-500 mb-2">Kids: <Text className="font-bold text-stone-800">{kids}</Text></Text>
            <View className="flex-row gap-2">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setKids(n)}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    kids === n ? 'bg-primary-500' : 'bg-stone-100'
                  }`}
                >
                  <Text className={`font-semibold ${kids === n ? 'text-white' : 'text-stone-600'}`}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Cuisine */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-stone-700 mb-3">Regional cuisine preference</Text>
          <View className="flex-row flex-wrap gap-2">
            {CUISINE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setCuisine(opt.value)}
                className={`px-4 py-2.5 rounded-xl flex-row items-center gap-1.5 ${
                  cuisine === opt.value
                    ? 'bg-primary-500'
                    : 'bg-stone-50 border border-stone-200'
                }`}
              >
                <Text className="text-base">{opt.emoji}</Text>
                <Text
                  className={`text-sm font-medium ${
                    cuisine === opt.value ? 'text-white' : 'text-stone-700'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Diet */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-stone-700 mb-3">Dietary preference</Text>
          <View className="gap-2">
            {DIET_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setDiet(opt.value)}
                className={`px-4 py-3.5 rounded-xl flex-row items-center gap-3 ${
                  diet === opt.value
                    ? 'border-2'
                    : 'bg-stone-50 border border-stone-200'
                }`}
                style={diet === opt.value ? { borderColor: opt.color, backgroundColor: opt.color + '10' } : {}}
              >
                <Text className="text-2xl">{opt.emoji}</Text>
                <Text
                  className={`text-base font-medium ${
                    diet === opt.value ? 'text-stone-800' : 'text-stone-700'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-stone-100">
        <Button title="Next — Customize Groceries" onPress={handleNext} loading={loading} fullWidth size="lg" />
      </View>
    </SafeAreaView>
  );
}
