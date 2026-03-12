export const API_URL = __DEV__
  ? 'http://192.168.1.28:5002/api'
  : 'https://api.pantrypal.com/api';

export const CUISINE_OPTIONS = [
  { value: 'north_indian', label: 'North Indian', emoji: '🍛' },
  { value: 'south_indian', label: 'South Indian', emoji: '🥘' },
  { value: 'bengali', label: 'Bengali', emoji: '🐟' },
  { value: 'gujarati', label: 'Gujarati', emoji: '🫓' },
  { value: 'maharashtrian', label: 'Maharashtrian', emoji: '🌶️' },
  { value: 'punjabi', label: 'Punjabi', emoji: '🧈' },
  { value: 'rajasthani', label: 'Rajasthani', emoji: '🏜️' },
  { value: 'pan_indian', label: 'Pan-Indian', emoji: '🇮🇳' },
];

export const DIET_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬', color: '#22C55E' },
  { value: 'non_vegetarian', label: 'Non-Vegetarian', emoji: '🍗', color: '#EF4444' },
  { value: 'eggetarian', label: 'Eggetarian', emoji: '🥚', color: '#EAB308' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱', color: '#16A34A' },
];

export const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 Weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Every 3 Months' },
];

export const SHOPPING_APPS = [
  { value: 'blinkit', label: 'Blinkit', color: '#F8E71C', icon: '⚡' },
  { value: 'zepto', label: 'Zepto', color: '#7B2FF2', icon: '🚀' },
  { value: 'bigbasket', label: 'BigBasket', color: '#84C225', icon: '🧺' },
  { value: 'swiggy_instamart', label: 'Swiggy Instamart', color: '#FC8019', icon: '🛵' },
  { value: 'jiomart', label: 'JioMart', color: '#0078D4', icon: '🛒' },
  { value: 'amazon_fresh', label: 'Amazon Fresh', color: '#FF9900', icon: '📦' },
  { value: 'local_kirana', label: 'Local Kirana (WhatsApp)', color: '#25D366', icon: '🏪' },
];

export const CATEGORY_META: Record<string, { name: string; icon: string }> = {
  dals_pulses: { name: 'Dals & Pulses', icon: '🫘' },
  rice_grains: { name: 'Rice & Grains', icon: '🍚' },
  atta_flour: { name: 'Atta & Flour', icon: '🌾' },
  spices_masalas: { name: 'Spices & Masalas', icon: '🌶️' },
  oils_ghee: { name: 'Oils & Ghee', icon: '🫗' },
  salt_sugar: { name: 'Salt, Sugar & Essentials', icon: '🧂' },
  tea_coffee: { name: 'Tea & Coffee', icon: '☕' },
  dairy: { name: 'Dairy & Milk', icon: '🥛' },
  snacks_namkeen: { name: 'Snacks & Namkeen', icon: '🍿' },
  pickles_chutneys: { name: 'Pickles & Chutneys', icon: '🫙' },
  dry_fruits: { name: 'Dry Fruits & Nuts', icon: '🥜' },
  cleaning_household: { name: 'Cleaning & Household', icon: '🧹' },
  personal_care: { name: 'Personal Care', icon: '🧴' },
  vegetables: { name: 'Vegetables', icon: '🥬' },
  fruits: { name: 'Fruits', icon: '🍎' },
};

export const UNITS = ['kg', 'g', 'L', 'ml', 'packet', 'piece', 'dozen', 'box', 'bottle', 'pouch'];
