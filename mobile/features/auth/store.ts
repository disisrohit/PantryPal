import { create } from 'zustand';
import { storage } from '../../lib/storage';
import { authApi } from './api';
import { User, LoginPayload, RegisterPayload } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const token = await storage.getToken();
      if (token) {
        const { user } = await authApi.getMe();
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      await storage.clear();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (payload) => {
    const { user, token } = await authApi.login(payload);
    await storage.setToken(token);
    await storage.setUser(user);
    set({ user, token, isAuthenticated: true });
  },

  register: async (payload) => {
    const { user, token } = await authApi.register(payload);
    await storage.setToken(token);
    await storage.setUser(user);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await storage.clear();
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    set({ user });
    storage.setUser(user);
  },
}));
