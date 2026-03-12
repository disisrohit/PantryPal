export interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  household: Household;
  pantryCheckSchedule: 'weekly' | 'biweekly';
  pantryCheckDay: string;
  onboardingComplete: boolean;
  lastPantryCheck?: string;
  createdAt: string;
}

export interface Household {
  adultsCount: number;
  kidsCount: number;
  cuisinePreference: string;
  dietaryPreference: string;
  preferredApps: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  email?: string;
}
