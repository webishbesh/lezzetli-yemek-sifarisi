export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string; // main category id
  subCategory?: string; // specific sub-category id
  isPopular?: boolean;
  isFeatured?: boolean;
  rating?: number;
  calories?: number;
  prepTime?: string;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
  notes?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  parentId: string;
  description?: string;
  image?: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  description?: string;
  iconName: string; // e.g. 'utensils', 'coffee', 'beer', etc.
  subCategories: SubCategory[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

export type PageId = 'home' | 'menu' | 'about' | 'contact' | 'profile' | 'orders' | 'favorites';

export interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'Gözləmədə' | 'Təsdiqləndi' | 'Yolda' | 'Tamamlandı';
  address: string;
}
