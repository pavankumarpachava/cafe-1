// API Service Layer - Placeholder functions for REST API integration
// Base URL will be configured when connecting to backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function for API calls
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ============================================
// PRODUCTS API
// ============================================
export const productsApi = {
  // GET /api/products
  getAll: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<Product[]>('/products');
    const { products } = await import('@/data/products');
    return products;
  },

  // GET /api/products/:id
  getById: async (id: string) => {
    // TODO: Replace with actual API call
    // return apiRequest<Product>(`/products/${id}`);
    const { products } = await import('@/data/products');
    return products.find(p => p.id === Number(id)) || null;
  },

  // GET /api/products/category/:category
  getByCategory: async (category: string) => {
    // TODO: Replace with actual API call
    // return apiRequest<Product[]>(`/products/category/${category}`);
    const { products } = await import('@/data/products');
    return products.filter(p => p.category === category);
  },
};

// ============================================
// AUTH API
// ============================================
export const authApi = {
  // POST /api/auth/login
  login: async (email: string, password: string) => {
    // TODO: Replace with actual API call
    // return apiRequest<{ user: User; token: string }>('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    // });
    
    // Mock response
    return {
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
        credits: 150,
        avatar: null,
        addresses: [],
        cards: [],
        notifications: [],
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  // POST /api/auth/signup
  signup: async (email: string, password: string, name: string) => {
    // TODO: Replace with actual API call
    // return apiRequest<{ user: User; token: string }>('/auth/signup', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password, name }),
    // });
    
    // Mock response
    return {
      user: {
        id: Date.now().toString(),
        email,
        name,
        credits: 0,
        avatar: null,
        addresses: [],
        cards: [],
        notifications: [],
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  // POST /api/auth/google
  googleAuth: async (googleToken: string) => {
    // TODO: Replace with actual API call
    // return apiRequest<{ user: User; token: string }>('/auth/google', {
    //   method: 'POST',
    //   body: JSON.stringify({ token: googleToken }),
    // });
    
    // Mock response
    return {
      user: {
        id: Date.now().toString(),
        email: 'google.user@gmail.com',
        name: 'Google User',
        credits: 0,
        avatar: null,
        addresses: [],
        cards: [],
        notifications: [],
      },
      token: 'mock_jwt_token_google_' + Date.now(),
    };
  },

  // POST /api/auth/logout
  logout: async () => {
    // TODO: Replace with actual API call
    // return apiRequest('/auth/logout', { method: 'POST' });
    localStorage.removeItem('auth_token');
    return { success: true };
  },

  // GET /api/auth/verify
  verifyToken: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<{ valid: boolean; user: User }>('/auth/verify');
    const token = localStorage.getItem('auth_token');
    return { valid: !!token, user: null };
  },
};

// ============================================
// USER API
// ============================================
export const userApi = {
  // GET /api/user/profile
  getProfile: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<User>('/user/profile');
    return null;
  },

  // PUT /api/user/profile
  updateProfile: async (data: { name?: string; email?: string; preferredDrink?: string }) => {
    // TODO: Replace with actual API call
    // return apiRequest<User>('/user/profile', {
    //   method: 'PUT',
    //   body: JSON.stringify(data),
    // });
    return { success: true, ...data };
  },

  // PUT /api/user/avatar
  updateAvatar: async (imageData: string) => {
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('avatar', imageData);
    // return apiRequest<{ avatarUrl: string }>('/user/avatar', {
    //   method: 'PUT',
    //   body: formData,
    // });
    return { avatarUrl: imageData };
  },

  // GET /api/user/notifications
  getNotifications: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<Notification[]>('/user/notifications');
    return [];
  },

  // PUT /api/user/notifications/:id/read
  markNotificationRead: async (id: string) => {
    // TODO: Replace with actual API call
    // return apiRequest(`/user/notifications/${id}/read`, { method: 'PUT' });
    return { success: true, id };
  },

  // PUT /api/user/notifications/read-all
  markAllNotificationsRead: async () => {
    // TODO: Replace with actual API call
    // return apiRequest('/user/notifications/read-all', { method: 'PUT' });
    return { success: true };
  },

  // GET /api/user/rewards
  getRewards: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<{ credits: number; history: RewardHistory[] }>('/user/rewards');
    return { credits: 0, history: [] };
  },

  // GET /api/user/orders
  getOrders: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<Order[]>('/user/orders');
    return [];
  },

  // GET /api/user/orders/:id
  getOrderById: async (id: string) => {
    // TODO: Replace with actual API call
    // return apiRequest<Order>(`/user/orders/${id}`);
    return null;
  },

  // ============================================
  // ADDRESSES
  // ============================================
  
  // GET /api/user/addresses
  getAddresses: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<SavedAddress[]>('/user/addresses');
    return [];
  },

  // POST /api/user/addresses
  addAddress: async (address: Omit<import('@/types').SavedAddress, 'id'>) => {
    // TODO: Replace with actual API call
    // return apiRequest<SavedAddress>('/user/addresses', {
    //   method: 'POST',
    //   body: JSON.stringify(address),
    // });
    return { id: Date.now().toString(), ...address };
  },

  // PUT /api/user/addresses/:id
  updateAddress: async (id: string, address: Partial<import('@/types').SavedAddress>) => {
    // TODO: Replace with actual API call
    // return apiRequest<SavedAddress>(`/user/addresses/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(address),
    // });
    return { success: true, id, ...address };
  },

  // DELETE /api/user/addresses/:id
  deleteAddress: async (id: string) => {
    // TODO: Replace with actual API call
    // return apiRequest(`/user/addresses/${id}`, { method: 'DELETE' });
    return { success: true, id };
  },

  // ============================================
  // PAYMENT METHODS
  // ============================================
  
  // GET /api/user/cards
  getCards: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<SavedCard[]>('/user/cards');
    return [];
  },

  // POST /api/user/cards
  addCard: async (card: Omit<import('@/types').SavedCard, 'id'>) => {
    // TODO: Replace with actual API call
    // return apiRequest<SavedCard>('/user/cards', {
    //   method: 'POST',
    //   body: JSON.stringify(card),
    // });
    return { id: Date.now().toString(), ...card };
  },

  // DELETE /api/user/cards/:id
  deleteCard: async (id: string) => {
    // TODO: Replace with actual API call
    // return apiRequest(`/user/cards/${id}`, { method: 'DELETE' });
    return { success: true, id };
  },

  // PUT /api/user/cards/:id/default
  setDefaultCard: async (id: string) => {
    // TODO: Replace with actual API call
    // return apiRequest(`/user/cards/${id}/default`, { method: 'PUT' });
    return { success: true, id };
  },
};

// ============================================
// CART API
// ============================================
export const cartApi = {
  // GET /api/cart
  getCart: async () => {
    // TODO: Replace with actual API call
    // return apiRequest<CartItem[]>('/cart');
    return [];
  },

  // POST /api/cart
  addToCart: async (productId: string, quantity: number, size?: string) => {
    // TODO: Replace with actual API call
    // return apiRequest('/cart', {
    //   method: 'POST',
    //   body: JSON.stringify({ productId, quantity, size }),
    // });
    return { success: true, productId, quantity };
  },

  // PUT /api/cart/:productId
  updateCartItem: async (productId: string, quantity: number) => {
    // TODO: Replace with actual API call
    // return apiRequest(`/cart/${productId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify({ quantity }),
    // });
    return { success: true, productId, quantity };
  },

  // DELETE /api/cart/:productId
  removeFromCart: async (productId: string) => {
    // TODO: Replace with actual API call
    // return apiRequest(`/cart/${productId}`, { method: 'DELETE' });
    return { success: true, productId };
  },

  // DELETE /api/cart
  clearCart: async () => {
    // TODO: Replace with actual API call
    // return apiRequest('/cart', { method: 'DELETE' });
    return { success: true };
  },
};

// ============================================
// ORDERS API
// ============================================
export const ordersApi = {
  // POST /api/checkout
  checkout: async (orderData: {
    items: Array<{ productId: string; quantity: number; size?: string }>;
    fulfillmentMethod: 'delivery' | 'pickup-walkin' | 'drive-thru';
    address?: import('@/types').SavedAddress;
    paymentMethodId?: string;
    discountCode?: string;
    creditsApplied?: number;
    vehicleInfo?: { model: string; color: string };
  }) => {
    // TODO: Replace with actual API call
    // return apiRequest<{ orderId: string; total: number }>('/checkout', {
    //   method: 'POST',
    //   body: JSON.stringify(orderData),
    // });
    return {
      orderId: 'ORD-' + Date.now(),
      total: 0,
      creditsEarned: 0,
    };
  },

  // POST /api/orders
  createOrder: async (orderData: import('@/types').Order) => {
    // TODO: Replace with actual API call
    // return apiRequest<Order>('/orders', {
    //   method: 'POST',
    //   body: JSON.stringify(orderData),
    // });
    return orderData;
  },

  // GET /api/orders/:id/status
  getOrderStatus: async (orderId: string) => {
    // TODO: Replace with actual API call
    // return apiRequest<{ status: string; updatedAt: string }>(`/orders/${orderId}/status`);
    return { status: 'processing', updatedAt: new Date().toISOString(), orderId };
  },

  // POST /api/orders/:id/cancel
  cancelOrder: async (orderId: string) => {
    // TODO: Replace with actual API call
    // return apiRequest(`/orders/${orderId}/cancel`, { method: 'POST' });
    return { success: true, orderId };
  },
};

// ============================================
// DISCOUNT API
// ============================================
export const discountApi = {
  // POST /api/discount/validate
  validateCode: async (code: string) => {
    // TODO: Replace with actual API call
    // return apiRequest<{ valid: boolean; discount: number; type: 'percentage' | 'fixed' }>('/discount/validate', {
    //   method: 'POST',
    //   body: JSON.stringify({ code }),
    // });
    
    // Mock discount codes
    const discounts: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
      'COFFEE10': { discount: 10, type: 'percentage' },
      'HOLIDAY20': { discount: 20, type: 'percentage' },
      'FIRST5': { discount: 5, type: 'fixed' },
    };
    
    const found = discounts[code.toUpperCase()];
    return found 
      ? { valid: true, ...found }
      : { valid: false, discount: 0, type: 'percentage' as const };
  },
};

// Export all APIs
export const api = {
  products: productsApi,
  auth: authApi,
  user: userApi,
  cart: cartApi,
  orders: ordersApi,
  discount: discountApi,
};

export default api;
