import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/ui/Button';
import { useScanStore } from '../../features/scan/store';
import { usePantryStore } from '../../features/pantry/store';
import { CATEGORY_META } from '../../lib/constants';
import type { ScannedItem } from '../../features/scan/types';

const STOCK_CONFIG: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  full: { color: '#16a34a', bg: '#dcfce7', label: 'Full', icon: '🟢' },
  half: { color: '#ca8a04', bg: '#fef9c3', label: 'Half', icon: '🟡' },
  low: { color: '#ea580c', bg: '#ffedd5', label: 'Low', icon: '🟠' },
  empty: { color: '#dc2626', bg: '#fee2e2', label: 'Empty', icon: '🔴' },
};

type ScreenMode = 'camera' | 'analyzing' | 'results';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScreenMode>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [confirmedItems, setConfirmedItems] = useState<Record<number, boolean>>({});
  const cameraRef = useRef<CameraView>(null);

  const { items: pantryItems } = usePantryStore();
  const {
    isAnalyzing,
    isApplying,
    analysis,
    analysisSource,
    error,
    runLocalAnalysis,
    analyzeImage,
    applyResults,
    clearAnalysis,
  } = useScanStore();

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });

      if (photo?.base64) {
        setCapturedImage(`data:image/jpeg;base64,${photo.base64}`);

        // Step 1: Instant local analysis
        const existingItems = (pantryItems || []).map((i: any) => ({
          name: i.name,
          category: i.category,
          currentStock: i.currentStock || 'full',
        }));
        runLocalAnalysis(photo.width || 0, photo.height || 0, existingItems);
        setMode('results'); // Show local results immediately

        // Step 2: Cloud AI analysis (Gemini) in background
        try {
          await analyzeImage(photo.base64);
        } catch {
          // Local results remain as fallback — no crash
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setConfirmedItems({});
    clearAnalysis();
    setMode('camera');
  };

  const toggleConfirm = (index: number) => {
    setConfirmedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleApplyResults = async () => {
    if (!analysis) return;

    const itemsToApply: ScannedItem[] = analysis.items
      .filter((_, i) => confirmedItems[i])
      .map(item => ({ ...item, confirmed: true }));

    if (itemsToApply.length === 0) {
      Alert.alert('No Items Selected', 'Please confirm at least one item to update your pantry.');
      return;
    }

    try {
      const { updatedCount } = await applyResults(itemsToApply);
      Alert.alert(
        'Pantry Updated! ✅',
        `Updated stock levels for ${updatedCount} items.`,
        [{ text: 'Scan Another', onPress: handleRetake }, { text: 'Done' }]
      );
    } catch {
      Alert.alert('Error', 'Failed to update pantry. Please try again.');
    }
  };

  // Permission not granted
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50 items-center justify-center">
        <ActivityIndicator size="large" color="#F97316" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50 items-center justify-center px-6">
        <Ionicons name="camera-outline" size={64} color="#a8a29e" />
        <Text className="text-lg font-semibold text-stone-700 text-center mt-4 mb-2">
          Camera Access Required
        </Text>
        <Text className="text-sm text-stone-500 text-center mb-6">
          PantryPal needs camera access to scan your pantry shelves and analyze stock levels with AI.
        </Text>
        <Button title="Grant Camera Access" onPress={requestPermission} size="lg" />
      </SafeAreaView>
    );
  }

  // Camera mode
  if (mode === 'camera') {
    return (
      <View className="flex-1 bg-black">
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        >
          {/* Header overlay */}
          <SafeAreaView className="flex-1">
            <View className="px-6 pt-2">
              <Text className="text-white text-lg font-bold text-center" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                📸 Scan Your Pantry
              </Text>
              <Text className="text-white/80 text-xs text-center mt-1" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                Point at shelves, containers, or jars
              </Text>
            </View>

            {/* Scan frame guide */}
            <View className="flex-1 items-center justify-center px-8">
              <View
                style={{
                  width: '100%',
                  aspectRatio: 4 / 3,
                  borderWidth: 2,
                  borderColor: 'rgba(249, 115, 22, 0.6)',
                  borderRadius: 16,
                  borderStyle: 'dashed',
                }}
              />
              <Text className="text-white/70 text-xs text-center mt-3" style={{ textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                Align pantry items within the frame
              </Text>
            </View>

            {/* Bottom controls */}
            <View className="items-center pb-8">
              <TouchableOpacity
                onPress={handleCapture}
                activeOpacity={0.7}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#F97316',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 4,
                  borderColor: 'rgba(255,255,255,0.5)',
                }}
              >
                <Ionicons name="scan" size={36} color="white" />
              </TouchableOpacity>
              <Text className="text-white/80 text-xs mt-2">Tap to scan</Text>
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  // Results mode (includes live-updating from local → cloud)
  const scannedItems = analysis?.items || [];
  const urgentItems = analysis?.restockUrgent || [];
  const soonItems = analysis?.restockSoon || [];
  const missingItems = analysis?.missingFromTypicalPantry || [];

  const sourceLabel = analysisSource === 'hybrid'
    ? { text: 'AI + Local', color: '#16a34a', bg: '#dcfce7', icon: '✨' }
    : analysisSource === 'cloud'
    ? { text: 'AI Analysis', color: '#2563eb', bg: '#dbeafe', icon: '☁️' }
    : { text: 'Local Preview', color: '#ca8a04', bg: '#fef9c3', icon: '📱' };

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-stone-800">Scan Results</Text>
          <View className="flex-row items-center mt-1">
            <View
              style={{ backgroundColor: sourceLabel.bg }}
              className="rounded-full px-2 py-0.5 flex-row items-center mr-2"
            >
              <Text className="text-xs mr-1">{sourceLabel.icon}</Text>
              <Text style={{ color: sourceLabel.color }} className="text-xs font-semibold">
                {sourceLabel.text}
              </Text>
            </View>
            <Text className="text-xs text-stone-400">
              {scannedItems.length} items
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleRetake} className="bg-stone-100 rounded-full p-2">
          <Ionicons name="camera-reverse" size={24} color="#78716c" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Cloud AI processing banner */}
        {isAnalyzing && (
          <View className="mx-4 mb-3 bg-primary-50 rounded-2xl p-3 flex-row items-center">
            <ActivityIndicator size="small" color="#F97316" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold text-primary-800">Gemini AI analyzing...</Text>
              <Text className="text-xs text-primary-600">Detecting containers, fill levels & missing items</Text>
            </View>
          </View>
        )}

        {/* Error banner (non-blocking) */}
        {error && (
          <View className="mx-4 mb-3 bg-amber-50 rounded-2xl p-3">
            <Text className="text-xs text-amber-700">{error}</Text>
          </View>
        )}

        {/* Overall Assessment */}
        {analysis?.overallAssessment && (
          <View className="mx-4 mb-4 bg-blue-50 rounded-2xl p-4">
            <Text className="text-sm font-semibold text-blue-800 mb-1">
              {analysisSource === 'hybrid' || analysisSource === 'cloud' ? '🤖 AI Assessment' : '📱 Quick Assessment'}
            </Text>
            <Text className="text-sm text-blue-700">{analysis.overallAssessment}</Text>
          </View>
        )}

        {/* Urgent Restock */}
        {urgentItems.length > 0 && (
          <View className="mx-4 mb-4 bg-red-50 rounded-2xl p-4">
            <Text className="text-sm font-semibold text-red-800 mb-2">🚨 Restock Now</Text>
            {urgentItems.map((item, i) => (
              <Text key={i} className="text-sm text-red-700">• {item}</Text>
            ))}
          </View>
        )}

        {/* Restock Soon */}
        {soonItems.length > 0 && (
          <View className="mx-4 mb-4 bg-amber-50 rounded-2xl p-4">
            <Text className="text-sm font-semibold text-amber-800 mb-2">⏰ Restock Soon</Text>
            {soonItems.map((item, i) => (
              <Text key={i} className="text-sm text-amber-700">• {item}</Text>
            ))}
          </View>
        )}

        {/* Detected Items */}
        <View className="px-4 mb-4">
          <Text className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3 px-2">
            Detected Items
          </Text>
          {scannedItems.map((item, index) => {
            const stock = STOCK_CONFIG[item.estimatedStock] || STOCK_CONFIG.full;
            const isConfirmed = confirmedItems[index] ?? true;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => toggleConfirm(index)}
                activeOpacity={0.7}
                className={`flex-row items-center py-3 px-3 mb-1 rounded-xl ${
                  isConfirmed ? 'bg-white' : 'bg-stone-100 opacity-60'
                }`}
              >
                {/* Confirm checkbox */}
                <View
                  className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-3 ${
                    isConfirmed ? 'border-primary-500 bg-primary-500' : 'border-stone-300'
                  }`}
                >
                  {isConfirmed && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>

                {/* Item details */}
                <View className="flex-1">
                  <Text className="text-base font-medium text-stone-800">{item.name}</Text>
                  <View className="flex-row items-center mt-0.5">
                    <Text className="text-xs text-stone-400">
                      {CATEGORY_META[item.category]?.name || item.category}
                    </Text>
                    {item.confidence > 0 && (
                      <Text className="text-xs text-stone-300 ml-2">
                        {Math.round(item.confidence * 100)}% sure
                      </Text>
                    )}
                  </View>
                  {item.notes && (
                    <Text className="text-xs text-stone-400 mt-0.5 italic">{item.notes}</Text>
                  )}
                </View>

                {/* Stock badge */}
                <View
                  style={{ backgroundColor: stock.bg }}
                  className="rounded-full px-3 py-1 flex-row items-center"
                >
                  <Text className="text-xs mr-1">{stock.icon}</Text>
                  <Text style={{ color: stock.color }} className="text-xs font-semibold">
                    {stock.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Missing Items */}
        {missingItems.length > 0 && (
          <View className="px-4 mb-4">
            <Text className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3 px-2">
              Missing from Pantry
            </Text>
            <View className="bg-stone-100 rounded-2xl p-4">
              {missingItems.map((item, i) => (
                <View key={i} className="flex-row items-center py-1">
                  <Text className="text-stone-400 mr-2">○</Text>
                  <Text className="text-sm text-stone-600">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Captured image thumbnail */}
        {capturedImage && (
          <View className="px-4 mb-4">
            <Text className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3 px-2">
              Scanned Photo
            </Text>
            <Image
              source={{ uri: capturedImage }}
              style={{ width: '100%', height: 200, borderRadius: 16 }}
              resizeMode="cover"
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom action bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-4"
        style={{ paddingBottom: 32 }}
      >
        <Button
          title={`Update Pantry (${Object.values(confirmedItems).filter(Boolean).length} items)`}
          onPress={handleApplyResults}
          loading={isApplying}
          size="lg"
          fullWidth
        />
        <TouchableOpacity onPress={handleRetake} className="mt-2 py-2">
          <Text className="text-center text-sm text-stone-500">Scan another photo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
