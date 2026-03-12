import apiClient from '../../lib/api-client';
import { GroceryItem, GroceryTemplate, PantryCheck, PantryCheckEntry, GuestAdjustment, GroupedItems } from './types';

export const pantryApi = {
  async getItems(): Promise<{ items: GroceryItem[]; grouped: GroupedItems; total: number }> {
    const { data } = await apiClient.get('/pantry');
    return data;
  },

  async getLowItems(): Promise<{ items: GroceryItem[]; count: number }> {
    const { data } = await apiClient.get('/pantry/low');
    return data;
  },

  async updateItem(id: string, updates: Partial<GroceryItem>): Promise<{ item: GroceryItem }> {
    const { data } = await apiClient.put(`/pantry/${id}`, updates);
    return data;
  },

  async addItem(item: Partial<GroceryItem>): Promise<{ item: GroceryItem }> {
    const { data } = await apiClient.post('/pantry', item);
    return data;
  },

  async removeItem(id: string): Promise<void> {
    await apiClient.delete(`/pantry/${id}`);
  },

  async submitCheck(items: PantryCheckEntry[], guestAdjustment?: GuestAdjustment): Promise<{ check: PantryCheck; summary: any }> {
    const { data } = await apiClient.post('/pantry/check', { items, guestAdjustment });
    return data;
  },

  async getCheckHistory(): Promise<{ checks: PantryCheck[] }> {
    const { data } = await apiClient.get('/pantry/checks');
    return data;
  },

  async getTemplates(): Promise<{ templates: GroceryTemplate[] }> {
    const { data } = await apiClient.get('/household/templates');
    return data;
  },

  async applyTemplate(templateId: string, customizations?: any[]): Promise<{ items: GroceryItem[]; count: number }> {
    const { data } = await apiClient.post('/household/apply-template', { templateId, customizations });
    return data;
  },
};
