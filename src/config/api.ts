// API Configuration
const getApiBaseUrl = () => {
  // In production, always use the production backend URL
  if (import.meta.env.PROD) {
    const prodUrl = 'https://janu-ecommerce-backend.onrender.com/api';
    console.log('Using production API URL:', prodUrl);
    return prodUrl;
  }
  
  // In development, use localhost
  console.log('Using development API URL');
  return 'http://localhost:5000/api';
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

// Helper function to get and validate token
const getAuthToken = (): string | null => {
  try {
    // Check for token in different possible storage locations
    const tokenSources = [
      localStorage.getItem('token'),
      localStorage.getItem('janu_admin_session'),
      localStorage.getItem(process.env.REACT_APP_TOKEN_KEY || 'janu_ecom_token')
    ];

    // Find the first valid token
    for (const token of tokenSources) {
      if (!token) continue;
      
      try {
        // Clean up the token
        let cleanToken = token.trim();
        
        // Remove any surrounding quotes if present
        cleanToken = cleanToken.replace(/^"|"$|^'|'$/g, '');
        
        // Check if it's a JWT (should have 3 parts when split by '.')
        const parts = cleanToken.split('.');
        if (parts.length === 3) {
          // If it already has Bearer prefix, return as is
          if (cleanToken.startsWith('Bearer ')) {
            console.log('🔑 Found valid token with Bearer prefix');
            return cleanToken;
          }
          // Otherwise add Bearer prefix
          console.log('🔑 Found valid token, adding Bearer prefix');
          return `Bearer ${cleanToken}`;
        } else {
          console.warn('Token format is not a valid JWT:', cleanToken.substring(0, 20) + '...');
        }
      } catch (e) {
        console.warn('Error processing token:', e);
        continue;
      }
    }
    
    console.log('ℹ️ No valid token found in storage');
    return null;
  } catch (error) {
    console.error('❌ Error in getAuthToken:', error);
    return null;
  }
};

// Enhanced API call wrapper with retry logic and token handling
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const maxRetries = 3;
  let lastError: any;
  
  // Skip token for auth endpoints
  const isAuthEndpoint = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh-token'
  ].some(path => endpoint.startsWith(path));
  
  // Get and validate token for authenticated requests
  const token = !isAuthEndpoint ? getAuthToken() : null;
  
  // Log token status for debugging
  if (!isAuthEndpoint) {
    console.log('🔑 Token status:', token ? 'Found' : 'Not found');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API call attempt ${attempt}/${maxRetries}:`, `${API_BASE_URL}${endpoint}`);
      
      // Prepare headers with proper type
      const headers = new Headers({
        'Content-Type': 'application/json',
        ...(token && !isAuthEndpoint ? { 'Authorization': token } : {})
      });
      
      // Add any additional headers from options
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          if (value) headers.set(key, String(value));
        });
      }
      
      // Create controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        // Handle 401 Unauthorized - token might be expired or invalid
        if (response.status === 401) {
          console.warn('⚠️ Authentication failed - token might be expired or invalid');
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('janu_admin_session');
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/#/admin/login';
          }
          return { 
            success: false, 
            error: 'Your session has expired. Please log in again.' 
          };
        }

        if (response.ok) {
          try {
            const data = await response.json();
            console.log('✅ API call successful');
            return { success: true, data };
          } catch (e) {
            console.warn('⚠️ Success response but failed to parse JSON');
            return { success: true, data: {} };
          }
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { message: `HTTP error ${response.status}` };
          }
          console.warn(`⚠️ API call failed with status ${response.status}:`, errorData);
          return { 
            success: false, 
            error: errorData.message || 'API call failed',
            status: response.status
          };
        }
      } catch (error) {
        clearTimeout(timeoutId);
        throw error; // Re-throw to be caught by outer try-catch
      }
    } catch (error: any) {
      lastError = error;
      const errorMessage = error.name === 'AbortError' 
        ? 'Request timed out' 
        : error.message || 'Network error';
      
      console.error(`❌ API call attempt ${attempt} failed:`, errorMessage);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = 1000 * Math.pow(2, attempt - 1);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return { 
    success: false, 
    error: lastError?.message || 'All API call attempts failed',
    status: lastError?.status || 500
  };
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
  ADMIN_PRODUCTS: '/admin/products',
  
  UPDATE_PROFILE: '/users/update-profile',
  
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