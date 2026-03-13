import { create } from 'zustand';
import { shoppingApi } from './api';
import { ShoppingList } from './types';
import { GuestAdjustment } from '../pantry/types';

interface ShoppingState {
  currentList: ShoppingList | null;
  lists: ShoppingList[];
  isLoading: boolean;
  isGenerating: boolean;

  generateList: (guestAdjustment?: GuestAdjustment) => Promise<void>;
  fetchLists: () => Promise<void>;
  fetchList: (id: string) => Promise<void>;
  toggleItem: (listId: string, itemId: string) => Promise<void>;
  markOrdered: (listId: string, app: string) => Promise<void>;
  markCompleted: (listId: string) => Promise<void>;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  currentList: null,
  lists: [],
  isLoading: false,
  isGenerating: false,

  generateList: async (guestAdjustment) => {
    set({ isGenerating: true });
    try {
      const data = await shoppingApi.generateList(guestAdjustment);
      if (!data.list) {
        set({ isGenerating: false });
        throw { fullyStocked: true, message: data.message || 'Your pantry is fully stocked!' };
      }
      set({ currentList: data.list, isGenerating: false });
    } catch (error) {
      set({ isGenerating: false });
      throw error;
    }
  },

  fetchLists: async () => {
    set({ isLoading: true });
    try {
      const { lists } = await shoppingApi.getLists();
      set({ lists, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchList: async (id) => {
    const { list } = await shoppingApi.getList(id);
    set({ currentList: list });
  },

  toggleItem: async (listId, itemId) => {
    const list = get().currentList;
    if (!list) return;

    const item = list.items.find((i) => i._id === itemId);
    if (!item) return;

    const updated = await shoppingApi.updateList(listId, {
      items: [{ _id: itemId, included: !item.included } as any],
    });
    set({ currentList: updated.list });
  },

  markOrdered: async (listId, app) => {
    const updated = await shoppingApi.updateList(listId, {
      status: 'ordered',
      orderedVia: app,
    });
    set({ currentList: updated.list });
  },

  markCompleted: async (listId) => {
    const updated = await shoppingApi.updateList(listId, {
      status: 'completed',
    });
    set({ currentList: updated.list });
  },
}));
