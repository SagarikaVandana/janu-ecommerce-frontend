// API Configuration
const getApiBaseUrl = () => {
  console.log('Environment:', import.meta.env.MODE);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  // Check for environment variable first (this takes highest priority)
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL;
    console.log('Using VITE_API_URL from environment:', url);
    return url.endsWith('/') ? url.slice(0, -1) : url; // Remove trailing slash if present
  }
  
  // Check if we're in development mode or running locally
  if (import.meta.env.DEV || 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '') {
    console.log('Using development API URL');
    return 'http://localhost:5000/api';
  }
  
  // Production URL - point to your Render backend
  const prodUrl = 'https://janu-ecommerce-backend.onrender.com/api';
  console.log('Using production API URL:', prodUrl);
  return prodUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// Enhanced health check function with better error handling
export const checkApiHealth = async () => {
  try {
    console.log('🔍 Checking API health at:', `${API_BASE_URL}/health`);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API health check successful:', data);
      return true;
    } else {
      console.warn('⚠️ API health check failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ API health check failed:', error);
    return false;
  }
};

// Enhanced API call wrapper with retry logic
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API call attempt ${attempt}/${maxRetries}:`, `${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API call successful:', data);
        return { success: true, data };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.warn(`⚠️ API call failed with status ${response.status}:`, errorData);
        return { success: false, error: errorData.message || 'API call failed' };
      }
    } catch (error: any) {
      lastError = error;
      console.error(`❌ API call attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  return { success: false, error: lastError?.message || 'All API call attempts failed' };
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