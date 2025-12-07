import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, User, Notification, Order, Product, FulfillmentMethod } from '@/types';

interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, item: CartItem) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist/Favorites
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;

  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateAvatar: (avatar: string) => void;

  // Credits/Rewards
  addCredits: (amount: number) => void;
  useCredits: (amount: number) => boolean;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;

  // Orders
  orders: Order[];
  placeOrder: (useCredits: boolean, fulfillmentMethod?: FulfillmentMethod) => Order | null;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('coffee-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('coffee-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('coffee-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('coffee-notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Welcome to Coffee Store!',
        description: 'Enjoy 20% off your first order with code WELCOME20',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'promo'
      },
      {
        id: '2',
        title: 'Christmas Special',
        description: 'New Gingerbread Latte is here! Try it today.',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'promo'
      }
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('coffee-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('coffee-theme');
    return saved === 'dark';
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem('coffee-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('coffee-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('coffee-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('coffee-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('coffee-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('coffee-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('coffee-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Cart functions
  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartItem = (index: number, item: CartItem) => {
    setCart(prev => prev.map((existing, i) => i === index ? item : existing));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const sizeMultiplier = item.size === 'S' ? 1 : item.size === 'M' ? 1.25 : 1.5;
    return sum + (item.product.price * sizeMultiplier * item.quantity);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist functions
  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(p => p.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(p => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existingUser = localStorage.getItem('coffee-user-data-' + email);
    if (existingUser) {
      const userData = JSON.parse(existingUser);
      setUser(userData);
      return true;
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      credits: 50,
      createdAt: new Date()
    };
    localStorage.setItem('coffee-user-data-' + email, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const googleUser: User = {
      id: crypto.randomUUID(),
      name: 'Coffee Lover',
      email: 'coffee.lover@gmail.com',
      credits: 100,
      createdAt: new Date()
    };
    setUser(googleUser);
    return true;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      credits: 50,
      createdAt: new Date()
    };
    localStorage.setItem('coffee-user-data-' + email, JSON.stringify(newUser));
    setUser(newUser);
    addNotification({
      title: 'Welcome aboard!',
      description: 'You earned 50 bonus credits for signing up!',
      type: 'reward'
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('coffee-user-data-' + user.email, JSON.stringify(updatedUser));
    }
  };

  const updateAvatar = (avatar: string) => {
    updateUser({ avatar });
  };

  // Credits functions
  const addCredits = (amount: number) => {
    if (user) {
      updateUser({ credits: user.credits + amount });
    }
  };

  const useCredits = (amount: number): boolean => {
    if (user && user.credits >= amount) {
      updateUser({ credits: user.credits - amount });
      return true;
    }
    return false;
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Order functions
  const placeOrder = (useCreditsForOrder: boolean, fulfillmentMethod: FulfillmentMethod = 'delivery'): Order | null => {
    if (cart.length === 0) return null;

    let creditsUsed = 0;
    let finalTotal = cartTotal;

    if (useCreditsForOrder && user) {
      const maxCreditsToUse = Math.min(user.credits, Math.floor(cartTotal * 100) / 100);
      creditsUsed = maxCreditsToUse;
      finalTotal = Math.max(0, cartTotal - creditsUsed);
      useCredits(creditsUsed);
    }

    const creditsEarned = Math.floor(finalTotal);

    const order: Order = {
      id: crypto.randomUUID(),
      items: [...cart],
      total: finalTotal,
      creditsEarned,
      creditsUsed,
      createdAt: new Date(),
      status: 'processing',
      fulfillmentMethod
    };

    setOrders(prev => [order, ...prev]);
    addCredits(creditsEarned);
    clearCart();

    addNotification({
      title: 'Order Placed!',
      description: `Your order #${order.id.slice(0, 8)} is being prepared.`,
      type: 'order'
    });

    if (creditsEarned > 0) {
      addNotification({
        title: 'Credits Earned!',
        description: `You earned ${creditsEarned} credits from this order.`,
        type: 'reward'
      });
    }

    return order;
  };

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <StoreContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      cartTotal,
      cartCount,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      user,
      isAuthenticated: !!user,
      login,
      loginWithGoogle,
      signup,
      logout,
      updateUser,
      updateAvatar,
      addCredits,
      useCredits,
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      unreadCount,
      orders,
      placeOrder,
      isDark,
      toggleTheme
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}