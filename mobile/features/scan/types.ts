export interface ScannedItem {
  name: string;
  nameHindi?: string;
  category: string;
  estimatedStock: 'full' | 'half' | 'low' | 'empty';
  confidence: number;
  notes?: string;
  confirmed?: boolean;
  addToInventory?: boolean;
}

export interface ScanAnalysis {
  items: ScannedItem[];
  missingFromTypicalPantry: string[];
  overallAssessment: string;
  restockUrgent: string[];
  restockSoon: string[];
}

export interface ApplyResult {
  message: string;
  updates: { itemId: string; name: string; newStock: string }[];
  newItems: ScannedItem[];
}
