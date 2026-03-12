import { create } from 'zustand';
import { pantryApi } from './api';
import { GroceryItem, GroupedItems, StockLevel, GuestAdjustment, PantryCheckEntry } from './types';

interface PantryState {
  items: GroceryItem[];
  grouped: GroupedItems;
  lowItems: GroceryItem[];
  isLoading: boolean;
  checkInProgress: boolean;
  checkEntries: Map<string, StockLevel>;
  guestAdjustment: GuestAdjustment;

  fetchItems: () => Promise<void>;
  fetchLowItems: () => Promise<void>;
  updateItemStock: (id: string, stock: StockLevel) => void;
  setGuestAdjustment: (adjustment: Partial<GuestAdjustment>) => void;
  submitPantryCheck: () => Promise<any>;
  resetCheck: () => void;
}

export const usePantryStore = create<PantryState>((set, get) => ({
  items: [],
  grouped: {},
  lowItems: [],
  isLoading: false,
  checkInProgress: false,
  checkEntries: new Map(),
  guestAdjustment: {
    enabled: false,
    additionalPeople: 0,
    duration: 'this_week',
  },

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const { items, grouped } = await pantryApi.getItems();
      set({ items, grouped, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchLowItems: async () => {
    try {
      const { items } = await pantryApi.getLowItems();
      set({ lowItems: items });
    } catch (error) {
      throw error;
    }
  },

  updateItemStock: (id, stock) => {
    const entries = new Map(get().checkEntries);
    entries.set(id, stock);
    set({ checkEntries: entries, checkInProgress: true });
  },

  setGuestAdjustment: (adjustment) => {
    set({
      guestAdjustment: { ...get().guestAdjustment, ...adjustment },
    });
  },

  submitPantryCheck: async () => {
    const { checkEntries, guestAdjustment } = get();
    const items: PantryCheckEntry[] = Array.from(checkEntries.entries()).map(
      ([itemId, stock]) => ({ itemId, stock })
    );

    if (items.length === 0) throw new Error('No items checked');

    const result = await pantryApi.submitCheck(items, guestAdjustment);

    // Refresh items after check
    await get().fetchItems();
    await get().fetchLowItems();

    // Reset check state
    set({ checkEntries: new Map(), checkInProgress: false });

    return result;
  },

  resetCheck: () => {
    set({
      checkEntries: new Map(),
      checkInProgress: false,
      guestAdjustment: { enabled: false, additionalPeople: 0, duration: 'this_week' },
    });
  },
}));
