import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../features/auth/store';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter phone and password');
      return;
    }
    setLoading(true);
    try {
      await login({ phone, password });
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login Failed', error?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10">
            <Text className="text-5xl mb-3">🏠</Text>
            <Text className="text-3xl font-bold text-stone-800">PantryPal</Text>
            <Text className="text-base text-stone-500 mt-1">Never forget your groceries</Text>
          </View>

          <View className="gap-4 mb-6">
            <View>
              <Text className="text-sm font-medium text-stone-600 mb-1.5">Phone Number</Text>
              <TextInput
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-base text-stone-800"
                placeholder="Enter your phone number"
                placeholderTextColor="#A8A29E"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                autoComplete="tel"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-stone-600 mb-1.5">Password</Text>
              <TextInput
                className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-base text-stone-800"
                placeholder="Enter your password"
                placeholderTextColor="#A8A29E"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <Button title="Login" onPress={handleLogin} loading={loading} fullWidth size="lg" />

          <View className="flex-row items-center justify-center mt-6 gap-1">
            <Text className="text-stone-500">Don't have an account?</Text>
            <Link href="/(auth)/register" className="text-primary-500 font-semibold">
              Sign Up
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
