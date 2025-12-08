export interface Product {
  id: number;
  name: string;
  category: string;
  main_image: string;
  images: string[];
  price: number;
  description: string;
  tastingNotes?: string[];
  ingredients?: string[];
  isHot?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: 'S' | 'M' | 'L';
  milk: 'whole' | 'oat' | 'almond' | 'none';
  sweetness: number;
  ice: 'none' | 'light' | 'regular' | 'extra';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  preferredDrink?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: 'order' | 'reward' | 'promo';
}

export type FulfillmentMethod = 'delivery' | 'pickup' | 'drivethru';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  creditsEarned: number;
  creditsUsed: number;
  createdAt: Date;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'delivered';
  fulfillmentMethod: FulfillmentMethod;
}
