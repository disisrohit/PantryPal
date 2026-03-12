export interface ShoppingItem {
  _id: string;
  itemId?: string;
  name: string;
  quantity: number;
  unit: string;
  brand?: string;
  category?: string;
  included: boolean;
  purchased: boolean;
  estimatedPrice?: number;
}

export interface ShoppingList {
  _id: string;
  userId: string;
  createdAt: string;
  status: 'draft' | 'ordered' | 'completed';
  items: ShoppingItem[];
  orderedVia: string;
  guestScaleFactor: number;
  notes?: string;
  completedAt?: string;
}

export interface DeepLink {
  name: string;
  quantity: string;
  links: Record<string, string>;
}

export interface DeepLinksResponse {
  links: DeepLink[];
  textList: string;
  totalItems: number;
}
