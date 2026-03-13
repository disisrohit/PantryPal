import apiClient from '../../lib/api-client';
import { ScanAnalysis, ScannedItem, ApplyResult } from './types';

export const scanApi = {
  async analyzeImage(base64Image: string): Promise<{ analysis: ScanAnalysis }> {
    // Vision AI can take 30-60s on first run (loading model into memory)
    const { data } = await apiClient.post('/scan/analyze', { image: base64Image }, { timeout: 90000 });
    return data;
  },

  async applyResults(items: ScannedItem[]): Promise<ApplyResult> {
    const { data } = await apiClient.post('/scan/apply', { items });
    return data;
  },

  async addMissingItems(items: { name: string; nameHindi?: string; category: string; quantity?: number; unit?: string }[]): Promise<{ items: any[]; count: number }> {
    const { data } = await apiClient.post('/scan/add-missing', { items });
    return data;
  },
};
