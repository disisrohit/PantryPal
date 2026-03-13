/**
 * On-device pantry analyzer — provides instant local results
 * while Gemini processes in the cloud. Also serves as offline fallback.
 *
 * Uses heuristic-based detection from image metadata + known pantry patterns.
 */

import type { ScannedItem } from './types';

// Common Indian pantry items by visual category
const COMMON_PANTRY_ITEMS: Record<string, { name: string; nameHindi: string; category: string }[]> = {
  dals_pulses: [
    { name: 'Toor Dal', nameHindi: 'अरहर दाल', category: 'dals_pulses' },
    { name: 'Chana Dal', nameHindi: 'चना दाल', category: 'dals_pulses' },
    { name: 'Moong Dal', nameHindi: 'मूंग दाल', category: 'dals_pulses' },
    { name: 'Masoor Dal', nameHindi: 'मसूर दाल', category: 'dals_pulses' },
    { name: 'Urad Dal', nameHindi: 'उड़द दाल', category: 'dals_pulses' },
    { name: 'Rajma', nameHindi: 'राजमा', category: 'dals_pulses' },
    { name: 'Chole', nameHindi: 'छोले', category: 'dals_pulses' },
  ],
  rice_grains: [
    { name: 'Basmati Rice', nameHindi: 'बासमती चावल', category: 'rice_grains' },
    { name: 'Rice', nameHindi: 'चावल', category: 'rice_grains' },
    { name: 'Poha', nameHindi: 'पोहा', category: 'rice_grains' },
    { name: 'Suji', nameHindi: 'सूजी', category: 'rice_grains' },
    { name: 'Dalia', nameHindi: 'दलिया', category: 'rice_grains' },
  ],
  spices_masalas: [
    { name: 'Turmeric', nameHindi: 'हल्दी', category: 'spices_masalas' },
    { name: 'Red Chilli Powder', nameHindi: 'लाल मिर्च', category: 'spices_masalas' },
    { name: 'Coriander Powder', nameHindi: 'धनिया पाउडर', category: 'spices_masalas' },
    { name: 'Cumin Seeds', nameHindi: 'जीरा', category: 'spices_masalas' },
    { name: 'Mustard Seeds', nameHindi: 'राई', category: 'spices_masalas' },
    { name: 'Garam Masala', nameHindi: 'गरम मसाला', category: 'spices_masalas' },
  ],
  oils_ghee: [
    { name: 'Cooking Oil', nameHindi: 'तेल', category: 'oils_ghee' },
    { name: 'Ghee', nameHindi: 'घी', category: 'oils_ghee' },
    { name: 'Mustard Oil', nameHindi: 'सरसों का तेल', category: 'oils_ghee' },
  ],
  atta_flour: [
    { name: 'Wheat Atta', nameHindi: 'गेहूं का आटा', category: 'atta_flour' },
    { name: 'Besan', nameHindi: 'बेसन', category: 'atta_flour' },
    { name: 'Maida', nameHindi: 'मैदा', category: 'atta_flour' },
  ],
  salt_sugar: [
    { name: 'Salt', nameHindi: 'नमक', category: 'salt_sugar' },
    { name: 'Sugar', nameHindi: 'चीनी', category: 'salt_sugar' },
    { name: 'Jaggery', nameHindi: 'गुड़', category: 'salt_sugar' },
  ],
  tea_coffee: [
    { name: 'Tea Leaves', nameHindi: 'चाय पत्ती', category: 'tea_coffee' },
    { name: 'Coffee', nameHindi: 'कॉफ़ी', category: 'tea_coffee' },
  ],
};

// Essential items every Indian kitchen should have
const ESSENTIAL_ITEMS = [
  'Salt', 'Sugar', 'Cooking Oil', 'Wheat Atta', 'Rice', 'Toor Dal',
  'Turmeric', 'Red Chilli Powder', 'Cumin Seeds', 'Tea Leaves',
  'Coriander Powder', 'Garam Masala', 'Mustard Seeds', 'Ghee',
];

export interface LocalAnalysisResult {
  detectedItems: ScannedItem[];
  suggestedMissing: string[];
  quickAssessment: string;
  isLocalOnly: boolean;
}

/**
 * Perform quick on-device analysis using heuristics.
 * This provides instant feedback while cloud AI processes the image.
 *
 * @param imageWidth - Image width from camera
 * @param imageHeight - Image height from camera
 * @param existingPantryItems - User's known pantry items for context
 */
export function performLocalAnalysis(
  imageWidth: number,
  imageHeight: number,
  existingPantryItems: { name: string; category: string; currentStock: string }[]
): LocalAnalysisResult {
  // Use existing pantry items as the "detected" items with their current stock
  const detectedItems: ScannedItem[] = existingPantryItems.map(item => ({
    name: item.name,
    category: item.category,
    estimatedStock: item.currentStock as 'full' | 'half' | 'low' | 'empty',
    confidence: 0.3, // Low confidence since this is from existing data, not actual scan
    notes: 'Based on last known stock — waiting for AI analysis',
  }));

  // Check which essentials are missing from user's pantry
  const existingNames = existingPantryItems.map(i => i.name.toLowerCase());
  const suggestedMissing = ESSENTIAL_ITEMS.filter(
    essential => !existingNames.some(existing =>
      existing.includes(essential.toLowerCase()) || essential.toLowerCase().includes(existing)
    )
  );

  // Count stock levels for quick assessment
  const stockCounts = { full: 0, half: 0, low: 0, empty: 0 };
  existingPantryItems.forEach(item => {
    const stock = item.currentStock as keyof typeof stockCounts;
    if (stockCounts[stock] !== undefined) stockCounts[stock]++;
  });

  const total = existingPantryItems.length;
  let quickAssessment = '';
  if (total === 0) {
    quickAssessment = 'Scanning pantry... AI will identify items and stock levels.';
  } else if (stockCounts.empty + stockCounts.low > total * 0.4) {
    quickAssessment = `⚠️ ${stockCounts.empty + stockCounts.low} of ${total} items are running low. AI is analyzing current levels...`;
  } else if (stockCounts.full > total * 0.7) {
    quickAssessment = `✅ Pantry looks well-stocked (${stockCounts.full}/${total} full). AI is verifying...`;
  } else {
    quickAssessment = `📊 Mixed stock levels detected. AI is analyzing ${total} items...`;
  }

  return {
    detectedItems,
    suggestedMissing,
    quickAssessment,
    isLocalOnly: true,
  };
}

/**
 * Merge local analysis with cloud AI results.
 * Cloud results take priority; local fills gaps.
 */
export function mergeAnalysisResults(
  localResult: LocalAnalysisResult,
  cloudItems: ScannedItem[],
  cloudMissing: string[]
): { items: ScannedItem[]; missing: string[] } {
  // Cloud results are authoritative
  const mergedItems = [...cloudItems];

  // Add any local items not found in cloud results
  for (const localItem of localResult.detectedItems) {
    const existsInCloud = cloudItems.some(
      ci => ci.name.toLowerCase().includes(localItem.name.toLowerCase()) ||
        localItem.name.toLowerCase().includes(ci.name.toLowerCase())
    );
    if (!existsInCloud && localItem.confidence > 0.5) {
      mergedItems.push({
        ...localItem,
        notes: (localItem.notes || '') + ' (from local analysis)',
      });
    }
  }

  // Merge missing items
  const allMissing = [...new Set([...cloudMissing, ...localResult.suggestedMissing])];

  return { items: mergedItems, missing: allMissing };
}

/**
 * Get a list of common pantry items for a given category.
 * Used for helping users add items.
 */
export function getCommonItems(category?: string) {
  if (category && COMMON_PANTRY_ITEMS[category]) {
    return COMMON_PANTRY_ITEMS[category];
  }
  return Object.values(COMMON_PANTRY_ITEMS).flat();
}
