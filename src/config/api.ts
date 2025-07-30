// API Configuration
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to production API URL
  return 'https://janu-ecommerce-backend.onrender.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Add a simple health check function
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
};

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Product endpoints
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  
  // Order endpoints
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  USER_STATS: '/orders/user-stats',
  
  // User endpoints
  USER_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  
  // Admin endpoints
  ADMIN_DASHBOARD: '/admin/dashboard-stats',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_REPORTS: '/admin/reports',
  
  // Newsletter endpoints
  NEWSLETTER_SUBSCRIBE: '/newsletter/subscribe',
  
  // Payment endpoints
  PAYMENT_SETTINGS: '/payment-settings',
  
  // Health check
  HEALTH: '/health'
}; 