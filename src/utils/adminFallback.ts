// Admin Fallback Authentication System
import toast from 'react-hot-toast';

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
export const createFallbackAdminSession = async (email: string, password: string): Promise<boolean> => {
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

      // Create a more JWT-like token structure
      const sessionToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
        sub: 'admin-fallback-001',
        email: FALLBACK_ADMIN_CREDENTIALS.email,
        isAdmin: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
      }))}.dummy-signature`;
      
      // Store in localStorage with proper formatting
      const token = `Bearer ${sessionToken}`;
      console.log('🔑 Storing token in localStorage');
      
      // Clear any existing tokens first
      localStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Set new tokens
      localStorage.setItem(ADMIN_SESSION_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUser));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      // Set default axios authorization header
      if (typeof window !== 'undefined') {
        const axios = (await import('axios')).default;
        axios.defaults.headers.common['Authorization'] = token;
        console.log('🔑 Set default axios authorization header');
      }
      
      console.log('✅ Fallback admin session created successfully');
      toast.success('Admin session created (fallback mode)');
      return true;
    } else {
      console.warn('⚠️ Invalid admin credentials for fallback mode');
      toast.error('Invalid admin credentials');
      return false;
    }
  } catch (error) {
    console.error('❌ Error creating fallback admin session:', error);
    toast.error('Failed to create admin session');
    return false;
  }
};

// Function to check if user has valid admin session (fallback or real)
export const hasValidAdminSession = (): boolean => {
  try {
    // First check if we have a valid token in localStorage
    const token = localStorage.getItem('token') || localStorage.getItem(ADMIN_SESSION_KEY);
    if (!token) {
      console.log('❌ No admin session token found');
      return false;
    }
    
    // Check if token has the Bearer prefix
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    // Set the axios default header if it's not already set
    if (typeof window !== 'undefined') {
      const axios = require('axios');
      if (!axios.defaults.headers.common['Authorization']) {
        axios.defaults.headers.common['Authorization'] = authToken;
      }
    }
    
    // Check if we have user data
    const userJson = localStorage.getItem('user') || localStorage.getItem(ADMIN_USER_KEY);
    if (!userJson) {
      console.log('❌ No user data found in session');
      return false;
    }
    
    const user = JSON.parse(userJson);
    const isAdmin = user.isAdmin || (user.role === 'admin');
    
    if (!isAdmin) {
      console.log('❌ User does not have admin privileges');
      return false;
    }
    
    console.log('✅ Valid admin session found');
    return true;
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      return false;
    }
    
    const user = JSON.parse(userStr);
    return user && user.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin session:', error);
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
    const response = await fetch('https://janu-ecommerce-backend.onrender.com/api/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend connectivity test failed:', error);
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
  const backendAvailable = await testBackendConnectivity();
  
  if (!backendAvailable) {
    console.log('⚠️ Backend unavailable, using fallback authentication...');
    const fallbackSuccess = createFallbackAdminSession(email, password);
    
    if (fallbackSuccess) {
      const user = getCurrentAdminUser();
      return {
        success: true,
        user,
        fallbackMode: true
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials (fallback mode)',
        fallbackMode: true
      };
    }
  }
  
  // Backend is available, try normal authentication
  try {
    const response = await fetch('https://janu-ecommerce-backend.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.user && data.user.isAdmin) {
        // Store successful backend authentication with proper token formatting
        const token = data.token.startsWith('Bearer ') ? data.token : `Bearer ${data.token}`;
        console.log('🔑 Storing backend token:', token.substring(0, 20) + '...');
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Set default axios authorization header
        if (typeof window !== 'undefined') {
          const axios = (await import('axios')).default;
          axios.defaults.headers.common['Authorization'] = token;
        }
        
        return {
          success: true,
          user: data.user,
          fallbackMode: false
        };
      } else {
        // User exists but not admin, try fallback
        console.log('🔄 User not admin, trying fallback...');
        const fallbackSuccess = createFallbackAdminSession(email, password);
        
        if (fallbackSuccess) {
          const user = getCurrentAdminUser();
          return {
            success: true,
            user,
            fallbackMode: true
          };
        } else {
          return {
            success: false,
            error: 'User exists but lacks admin privileges',
            fallbackMode: false
          };
        }
      }
    } else {
      // Backend authentication failed, try fallback
      console.log('🔄 Backend auth failed, trying fallback...');
      const fallbackSuccess = createFallbackAdminSession(email, password);
      
      if (fallbackSuccess) {
        const user = getCurrentAdminUser();
        return {
          success: true,
          user,
          fallbackMode: true
        };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
        return {
          success: false,
          error: errorData.message || 'Authentication failed',
          fallbackMode: false
        };
      }
    }
  } catch (error) {
    console.log('🔄 Network error, trying fallback...');
    const fallbackSuccess = createFallbackAdminSession(email, password);
    
    if (fallbackSuccess) {
      const user = getCurrentAdminUser();
      return {
        success: true,
        user,
        fallbackMode: true
      };
    } else {
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        fallbackMode: true
      };
    }
  }
};
