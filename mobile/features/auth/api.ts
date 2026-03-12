import apiClient from '../../lib/api-client';
import { AuthResponse, LoginPayload, RegisterPayload, User } from './types';

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    const { data } = await apiClient.put('/auth/profile', updates);
    return data;
  },
};
