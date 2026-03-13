import { create } from 'zustand';
import { scanApi } from './api';
import { ScanAnalysis, ScannedItem } from './types';
import { LocalAnalysisResult, performLocalAnalysis, mergeAnalysisResults } from './localAnalyzer';

interface ScanState {
  isAnalyzing: boolean;
  isApplying: boolean;
  analysis: ScanAnalysis | null;
  localResult: LocalAnalysisResult | null;
  analysisSource: 'none' | 'local' | 'cloud' | 'hybrid';
  error: string | null;

  runLocalAnalysis: (imageWidth: number, imageHeight: number, pantryItems: { name: string; category: string; currentStock: string }[]) => void;
  analyzeImage: (base64Image: string) => Promise<void>;
  applyResults: (items: ScannedItem[]) => Promise<{ updatedCount: number }>;
  addMissingItems: (items: { name: string; category: string }[]) => Promise<number>;
  clearAnalysis: () => void;
}

export const useScanStore = create<ScanState>((set, get) => ({
  isAnalyzing: false,
  isApplying: false,
  analysis: null,
  localResult: null,
  analysisSource: 'none',
  error: null,

  // Step 1: Instant on-device analysis (runs immediately after capture)
  runLocalAnalysis: (imageWidth, imageHeight, pantryItems) => {
    const localResult = performLocalAnalysis(imageWidth, imageHeight, pantryItems);
    set({
      localResult,
      analysisSource: 'local',
      analysis: {
        items: localResult.detectedItems,
        missingFromTypicalPantry: localResult.suggestedMissing,
        overallAssessment: localResult.quickAssessment,
        restockUrgent: [],
        restockSoon: [],
      },
    });
  },

  // Step 2: Cloud AI analysis (Gemini), then merge with local
  analyzeImage: async (base64Image) => {
    set({ isAnalyzing: true, error: null });
    try {
      const { analysis: cloudAnalysis } = await scanApi.analyzeImage(base64Image);
      const localResult = get().localResult;

      if (localResult) {
        // Merge local + cloud results
        const merged = mergeAnalysisResults(
          localResult,
          cloudAnalysis.items || [],
          cloudAnalysis.missingFromTypicalPantry || []
        );
        set({
          analysis: {
            ...cloudAnalysis,
            items: merged.items,
            missingFromTypicalPantry: merged.missing,
          },
          isAnalyzing: false,
          analysisSource: 'hybrid',
        });
      } else {
        set({ analysis: cloudAnalysis, isAnalyzing: false, analysisSource: 'cloud' });
      }
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Cloud analysis unavailable';
      // If cloud fails, keep local results as fallback
      const currentAnalysis = get().analysis;
      if (currentAnalysis && get().analysisSource === 'local') {
        set({
          isAnalyzing: false,
          error: msg + ' — showing local analysis only.',
          analysisSource: 'local',
        });
      } else {
        set({ isAnalyzing: false, error: msg });
        throw error;
      }
    }
  },

  applyResults: async (items) => {
    set({ isApplying: true });
    try {
      const result = await scanApi.applyResults(items);
      set({ isApplying: false });
      return { updatedCount: result.updates.length };
    } catch (error) {
      set({ isApplying: false });
      throw error;
    }
  },

  addMissingItems: async (items) => {
    const result = await scanApi.addMissingItems(items);
    return result.count;
  },

  clearAnalysis: () => set({ analysis: null, localResult: null, error: null, analysisSource: 'none' }),
}));
