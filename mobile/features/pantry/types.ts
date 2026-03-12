export type StockLevel = 'full' | 'half' | 'low' | 'empty';
export type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export interface GroceryItem {
  _id: string;
  userId: string;
  name: string;
  nameHindi?: string;
  category: string;
  quantity: number;
  unit: string;
  frequency: Frequency;
  preferredBrand?: string;
  currentStock: StockLevel;
  lastRestocked?: string;
  avgConsumptionDays: number;
  predictedEmptyDate?: string;
  isActive: boolean;
  sortOrder: number;
  isCustom: boolean;
}

export interface GroceryTemplate {
  _id: string;
  name: string;
  cuisineType: string;
  dietaryType: string;
  description: string;
  items: TemplateItem[];
}

export interface TemplateItem {
  name: string;
  nameHindi?: string;
  category: string;
  quantity: number;
  defaultQuantity: number;
  unit: string;
  defaultFrequency: string;
  perPersonMultiplier: number;
  commonBrands: string[];
  sortOrder: number;
}

export interface PantryCheckEntry {
  itemId: string;
  stock: StockLevel;
}

export interface GuestAdjustment {
  enabled: boolean;
  additionalPeople: number;
  duration: 'this_week' | 'next_3_days' | 'next_2_weeks' | 'custom';
  customDays?: number;
}

export interface PantryCheck {
  _id: string;
  userId: string;
  date: string;
  items: Array<{
    itemId: string;
    itemName: string;
    previousStock: StockLevel;
    updatedStock: StockLevel;
  }>;
  guestAdjustment: GuestAdjustment;
  totalItemsChecked: number;
  itemsNeedingRestock: number;
}

export interface GroupedItems {
  [category: string]: GroceryItem[];
}
