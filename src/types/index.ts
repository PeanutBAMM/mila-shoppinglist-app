// User types
export type SubscriptionTier = 'free' | 'trial' | 'premium';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: SubscriptionTier;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

// Shopping list types
export interface Store {
  id: string;
  name: string;
  chain?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  name: string;
  store_id?: string;
  store?: Store;
  is_active?: boolean;
  completed_at?: string | null;
  items?: ShoppingItem[];
  created_at: string;
  updated_at: string;
}

export interface ShoppingItem {
  id: string;
  list_id: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  category?: string | null;
  notes?: string | null;
  price?: number | null;
  is_checked?: boolean | null;
  checked_at?: string | null;
  position?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Input types for creating/updating
export interface CreateListInput {
  name: string;
  storeId?: string;
  isActive?: boolean;
}

export interface CreateItemInput {
  name: string;
  quantity?: number;
  unit?: string;
  category?: string;
  notes?: string;
}

// Navigation types
export type RootStackParamList = {
  index: undefined;
  '(auth)': undefined;
  '(tabs)': undefined;
};