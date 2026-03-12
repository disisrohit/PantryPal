import apiClient from '../../lib/api-client';
import { ShoppingList, DeepLinksResponse } from './types';
import { GuestAdjustment } from '../pantry/types';

export const shoppingApi = {
  async generateList(guestAdjustment?: GuestAdjustment): Promise<{ list: ShoppingList }> {
    const { data } = await apiClient.post('/shopping/generate', { guestAdjustment });
    return data;
  },

  async getLists(status?: string): Promise<{ lists: ShoppingList[] }> {
    const params = status ? { status } : {};
    const { data } = await apiClient.get('/shopping', { params });
    return data;
  },

  async getList(id: string): Promise<{ list: ShoppingList }> {
    const { data } = await apiClient.get(`/shopping/${id}`);
    return data;
  },

  async updateList(id: string, updates: Partial<ShoppingList>): Promise<{ list: ShoppingList }> {
    const { data } = await apiClient.put(`/shopping/${id}`, updates);
    return data;
  },

  async getDeepLinks(id: string, app?: string): Promise<DeepLinksResponse> {
    const params = app ? { app } : {};
    const { data } = await apiClient.get(`/shopping/${id}/deeplinks`, { params });
    return data;
  },
};
