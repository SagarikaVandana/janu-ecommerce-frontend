// Admin Fallback Authentication System
import { toast } from 'react-hot-toast';

// Safe toast function that won't throw if toast is not available
const safeToast = {
  success: (message: string) => {
    if (typeof window !== 'undefined' && typeof toast !== 'undefined') {
      toast.success(message);
    } else {
      console.log(`[Toast Success] ${message}`);
    }
  },
  error: (message: string) => {
    if (typeof window !== 'undefined' && typeof toast !== 'undefined') {
      toast.error(message);
    } else {
      console.error(`[Toast Error] ${message}`);
    }
  }
};

// Fallback admin credentials for development/testing
const FALLBACK_ADMIN_CREDENTIALS = {
  email: 'janucollectionvizag@gmail.com',
  password: 'janu123',
  name: 'Janu Collection Admin',
  isAdmin: true
};

// Local storage keys
const ADMIN_SESSION_KEY = 'janu_admin_session';
const ADMIN_USER_KEY = 'janu_admin_user';

// Function to create a fallback admin session when backend is unavailable
export const createFallbackAdminSession = async (email: string, password: string): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
  fallbackMode?: boolean;
}> => {
  console.log('🔄 Creating fallback admin session...');
  
  try {
    // Verify credentials match the expected admin credentials
    if (email === FALLBACK_ADMIN_CREDENTIALS.email && password === FALLBACK_ADMIN_CREDENTIALS.password) {
      const adminUser = {
        _id: 'admin-fallback-001',
        id: 'admin-fallback-001',
        email: FALLBACK_ADMIN_CREDENTIALS.email,
        name: FALLBACK_ADMIN_CREDENTIALS.name,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        fallbackMode: true
      };

      // Create a properly formatted JWT token
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };
      
      const payload = {
        sub: 'admin-fallback-001',
        email: FALLBACK_ADMIN_CREDENTIALS.email,
        isAdmin: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
      };
      
      // Encode header and payload using URL-safe base64
      const encodedHeader = btoa(JSON.stringify(header))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
        
      const encodedPayload = btoa(JSON.stringify(payload))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Create a signature (dummy in this case)
      const signature = 'dummy-signature';
      
      // Combine to create JWT token
      const sessionToken = `Bearer ${encodedHeader}.${encodedPayload}.${signature}`;
      
      console.log('🔑 Storing admin token in localStorage');
      
      // Clear any existing tokens first
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Store the token with 'Bearer ' prefix
      const token = sessionToken;
      
      // Store the token and user data
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
        token: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        fallback: true
      }));
      
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUser));
      
      // Set axios default header if available
      if (typeof window !== 'undefined') {
        try {
          const axios = (await import('axios')).default;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (e) {
          console.warn('Axios not available for setting default headers');
        }
      }
      
      // Show success message
      safeToast.success('Fallback admin session created successfully');
      console.log('✅ Fallback admin session created successfully');
      return {
        success: true,
        token,
        user: adminUser,
        fallbackMode: true
      };
    } else {
      console.warn('⚠️ Invalid admin credentials for fallback mode');
      return {
        success: false,
        error: 'Invalid admin credentials'
      };
    }
  } catch (error) {
    console.error('❌ Error creating fallback admin session:', error);
    return {
      success: false,
      error: 'Failed to create admin session'
    };
  }
};

// Function to check if user has valid admin session (fallback or real)
export const hasValidAdminSession = (): boolean => {
  try {
    // Check for fallback admin session first
    const fallbackToken = localStorage.getItem(ADMIN_SESSION_KEY);
    const fallbackUser = localStorage.getItem(ADMIN_USER_KEY);
    
    if (fallbackToken && fallbackUser) {
      try {
        const fallbackUserData = JSON.parse(fallbackUser);
        if (fallbackUserData?.isAdmin) {
          console.log('🔄 Valid fallback admin session found');
          return true;
        }
      } catch (e) {
        console.error('Error parsing fallback user:', e);
      }
    }
    
    // Check for regular JWT token
    const authToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (authToken && userData) {
      try {
        const user = JSON.parse(userData);
        if (user?.isAdmin) {
          console.log('🔄 Valid admin session found');
          return true;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    console.log('❌ No valid admin session found');
    return false;
  } catch (error) {
    console.error('Error in hasValidAdminSession:', error);
    return false;
  }
};

// Function to get current admin user
export const getCurrentAdminUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.isAdmin ? user : null;
    }
    return null;
  } catch (error) {
    console.error('Error getting current admin user:', error);
    return null;
  }
};

// Function to clear admin session
export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('🧹 Admin session cleared');
};

// Function to test backend connectivity
export const testBackendConnectivity = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    // Use production URL for health check
    const response = await fetch('https://janu-ecommerce-backend.onrender.com/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Backend connectivity check failed:', error);
    return false;
  }
};

// Enhanced admin login with fallback support
export const enhancedAdminLogin = async (email: string, password: string): Promise<{
  success: boolean;
  user?: any;
  error?: string;
  fallbackMode?: boolean;
}> => {
  console.log('🚀 Starting enhanced admin login...');
  
  // First test backend connectivity
  let backendAvailable = false;
  
  try {
    console.log('🔍 Checking backend connectivity...');
    backendAvailable = await testBackendConnectivity();
    console.log(`🌐 Backend is ${backendAvailable ? 'available' : 'unavailable'}`);
    
    if (!backendAvailable) {
      console.log('⚠️ Backend unavailable, attempting fallback authentication...');
      return await handleFallbackLogin(email, password);
    }
    
    // Backend is available, try regular login
    console.log('🔐 Attempting regular admin login...');
    const response = await fetch('https://janu-ecommerce-backend.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      console.log('✅ Admin login successful');
      
      // Store the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Set default axios authorization header
      if (typeof window !== 'undefined') {
        const axios = (await import('axios')).default;
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      
      return {
        success: true,
        user: data.user,
        fallbackMode: false
      };
    } else {
      console.error('❌ Admin login failed:', data.message || 'Unknown error');
      
      // If login fails, try fallback if credentials match
      if (email === FALLBACK_ADMIN_CREDENTIALS.email && password === FALLBACK_ADMIN_CREDENTIALS.password) {
        console.log('🔄 Trying fallback authentication...');
        const fallbackResult = await handleFallbackLogin(email, password);
        if (fallbackResult.success) {
          return fallbackResult;
        }
      }
      
      return {
        success: false,
        error: data.message || 'Admin login failed',
        fallbackMode: false
      };
    }
  } catch (error) {
    console.error('❌ Error during admin login:', error);
    
    // If there's an error, try fallback if credentials match
    if (email === FALLBACK_ADMIN_CREDENTIALS.email && password === FALLBACK_ADMIN_CREDENTIALS.password) {
      console.log('🔄 Error occurred, trying fallback authentication...');
      const fallbackResult = await handleFallbackLogin(email, password);
      if (fallbackResult.success) {
        return fallbackResult;
      }
    }
    
    return {
      success: false,
      error: 'An error occurred during login',
      fallbackMode: false
    };
  }
};

// Helper function to handle fallback login
const handleFallbackLogin = async (email: string, password: string): Promise<{
  success: boolean;
  user?: any;
  error?: string;
  fallbackMode?: boolean;
}> => {
  try {
    const fallbackSuccess = await createFallbackAdminSession(email, password);
    
    if (fallbackSuccess) {
      // Verify the token was stored correctly
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        console.log('✅ Fallback authentication successful');
        return {
          success: true,
          user: JSON.parse(user),
          fallbackMode: true
        };
      }
    }
    
    return {
      success: false,
      error: 'Fallback authentication failed',
      fallbackMode: true
    };
  } catch (error) {
    console.error('Error in fallback login:', error);
    return {
      success: false,
      error: 'An error occurred during login',
      fallbackMode: true
    };
  }
};
