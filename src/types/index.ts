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

export interface SavedAddress {
  id: string;
  fullName: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface SavedCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  preferredDrink?: string;
  createdAt: Date;
  savedAddresses?: SavedAddress[];
  savedCards?: SavedCard[];
}

export interface GuestUser {
  isGuest: true;
  email?: string;
  name?: string;
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
  isGuestOrder?: boolean;
}
