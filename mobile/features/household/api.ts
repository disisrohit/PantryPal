import apiClient from '../../lib/api-client';
import { Household } from '../auth/types';

export const householdApi = {
  async updateHousehold(updates: Partial<Household>): Promise<{ household: Household }> {
    const { data } = await apiClient.put('/household', updates);
    return data;
  },

  async getHousehold(): Promise<{ household: Household }> {
    const { data } = await apiClient.get('/household');
    return data;
  },
};
