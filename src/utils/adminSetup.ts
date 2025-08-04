// Admin Setup Utility
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

export interface AdminCredentials {
  email: string;
  password: string;
  name: string;
}

// Function to create admin user if it doesn't exist
export const createAdminUser = async (credentials: AdminCredentials): Promise<boolean> => {
  try {
    console.log('🔧 Attempting to create admin user...');
    
    // First try with admin flag
    let response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...credentials,
        isAdmin: true
      }),
    });

    // If that fails, try without admin flag (regular user creation)
    if (!response.ok) {
      console.log('🔄 Retrying without admin flag...');
      response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password
        }),
      });
    }

    if (response.ok) {
      const data = await response.json();
      console.log('✅ User created successfully:', data);
      toast.success('User created successfully! You may need to manually set admin privileges.');
      return true;
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.warn('⚠️ Failed to create user:', errorData);
      toast.error(errorData.message || 'Failed to create user');
      return false;
    }
  } catch (error) {
    console.error('❌ Error creating user:', error);
    toast.error('Network error creating user');
    return false;
  }
};

// Function to test admin login with detailed error handling
export const testAdminLogin = async (email: string, password: string): Promise<{
  success: boolean;
  user?: any;
  error?: string;
  statusCode?: number;
}> => {
  try {
    console.log('🔍 Testing admin login for:', email);
    console.log('🔗 API endpoint:', `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`);
    
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful:', data);
      
      if (data.user && data.user.isAdmin) {
        console.log('✅ User has admin privileges');
        return { success: true, user: data.user };
      } else if (data.user) {
        console.warn('⚠️ User exists but is not an admin:', data.user);
        return { success: false, error: 'User exists but lacks admin privileges', statusCode: response.status };
      } else {
        console.warn('⚠️ Login successful but no user data returned');
        return { success: false, error: 'No user data returned', statusCode: response.status };
      }
    } else {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.warn('⚠️ Login failed:', errorData);
      } catch (parseError) {
        console.warn('⚠️ Login failed, could not parse error response');
      }
      return { success: false, error: errorMessage, statusCode: response.status };
    }
  } catch (error) {
    console.error('❌ Network error during login test:', error);
    return { success: false, error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

// Default admin credentials
export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'janucollectionvizag@gmail.com',
  password: 'janu123',
  name: 'Janu Collection Admin'
};

// Function to setup admin user with fallback options
export const setupAdminUser = async (): Promise<boolean> => {
  console.log('🚀 Starting admin user setup...');
  
  // First, try to login with existing credentials
  const loginTest = await testAdminLogin(
    DEFAULT_ADMIN_CREDENTIALS.email,
    DEFAULT_ADMIN_CREDENTIALS.password
  );
  
  if (loginTest.success) {
    console.log('✅ Admin user already exists and is working');
    return true;
  }
  
  console.log('⚠️ Admin login failed, attempting to create admin user...');
  
  // If login fails, try to create the admin user
  const createResult = await createAdminUser(DEFAULT_ADMIN_CREDENTIALS);
  
  if (createResult) {
    // Test login again after creation
    const secondLoginTest = await testAdminLogin(
      DEFAULT_ADMIN_CREDENTIALS.email,
      DEFAULT_ADMIN_CREDENTIALS.password
    );
    
    return secondLoginTest.success;
  }
  
  return false;
};
