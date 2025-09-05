// API Configuration
const getApiBaseUrl = () => {
  // Use Vite environment variables
  const env = import.meta.env;
  
  // Get API URL from environment variables or use default
  let apiUrl = env.VITE_API_URL || 
    (env.MODE === 'development' 
      ? 'http://localhost:5000' 
      : 'https://janu-ecommerce-backend.onrender.com'
    );
  
  // Ensure the URL has the /api prefix
  if (!apiUrl.endsWith('/api')) {
    apiUrl = apiUrl.endsWith('/') 
      ? `${apiUrl}api` 
      : `${apiUrl}/api`;
  }
  
  console.log(`Using ${env.MODE || 'production'} API URL:`, apiUrl);
  
  // Remove trailing slash if present
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// Common headers for all API requests
const getCommonHeaders = (token?: string | null) => ({
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
});

/**
 * Makes an authenticated API request with proper error handling
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> => {
  const token = getAuthToken();
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getCommonHeaders(token),
        ...(options.headers || {})
      },
      credentials: 'include' as RequestCredentials
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      // Handle unauthorized errors
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
      
      return { error: errorMessage };
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return { data: {} as T };
    }

    // Parse and return the response data
    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error('API request failed:', error);
    return { error: error.message || 'Network error occurred' };
  }
};


// Helper function to get and validate token
export const getAuthToken = (): string | null => {
  try {
    // Check for token in different possible storage locations
    const tokenSources = [
      localStorage.getItem('token'),
      localStorage.getItem('janu_admin_session'),
      localStorage.getItem(import.meta.env.VITE_TOKEN_KEY || 'janu_ecom_token')
    ];
    
    // Return the first valid token found
    const validToken = tokenSources.find(token => 
      token && typeof token === 'string' && token.length > 10
    );
    
    return validToken || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

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

// Helper function to make authenticated API calls
export const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  // Log the token status (without logging the actual token for security)
  console.log('Auth token status:', token ? 'Token exists' : 'No token found');
  
  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Ensure base URL doesn't end with a slash
  const baseUrl = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
    
  const url = `${baseUrl}${cleanEndpoint}`;
  
  console.log('API Request:', { 
    method: options.method || 'GET', 
    url,
    endpoint,
    baseUrl,
    hasToken: !!token
  });
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  });
  
  // Ensure we're not sending undefined or null in the body
  const body = options.body ? JSON.stringify(options.body) : undefined;
  
  try {
    console.log('Making request with headers:', Object.fromEntries(headers.entries()));
    
    const response = await fetch(url, {
      ...options,
      headers,
      body,
      credentials: 'include' // Important for cookies/sessions
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error('Authentication failed - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/#/admin/login';
      throw new Error('Session expired. Please log in again.');
    }
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('API error response:', errorData);
      } catch (e) {
        const text = await response.text();
        console.error('Failed to parse error response:', text);
        errorData = { message: `HTTP error! status: ${response.status} - ${text || response.statusText}` };
      }
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Handle empty responses (like 204 No Content)
    if (response.status === 204) {
      return {};
    }
    
    try {
      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh-token',
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
  UPDATE_PROFILE: '/users/update-profile',
  
  // Admin endpoints
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_DASHBOARD_STATS: '/admin/dashboard-stats',
  
  // Category endpoints
  CATEGORIES: '/categories',
  
  // Review endpoints
  REVIEWS: '/reviews',
  
  // Wishlist endpoints
  WISHLIST: '/wishlist',
  
  // Newsletter endpoints
  NEWSLETTER_SUBSCRIBE: '/newsletter/subscribe',
  
  // Payment endpoints
  PAYMENT_SETTINGS: '/payment-settings',
};