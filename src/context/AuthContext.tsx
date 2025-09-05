import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, isAdminLogin?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  checkAuth: () => Promise<boolean>;
  setAuthToken: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;
  const [isAdmin, setIsAdmin] = useState<boolean>(user?.isAdmin || false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ME}`, {
        timeout: 5000
      });
      const userData = response.data;
      setUser(userData);
      setIsAdmin(userData?.isAdmin || false);
      return userData;
    } catch (error) {
      console.warn('Failed to fetch user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      return null;
    } finally {
      setLoading(false);
    }
  };

  const setAuthToken = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    setIsAdmin(user.isAdmin || false);
  };

  const login = async (email: string, password: string, isAdminLogin: boolean = false): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login with:', { email, isAdminLogin, apiUrl: `${API_BASE_URL}${API_ENDPOINTS.LOGIN}` });
      
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, { 
        email: email.trim().toLowerCase(), 
        password,
        isAdmin: isAdminLogin
      });
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      if (isAdminLogin && !user.isAdmin) {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Store the token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update axios headers and state
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setIsAdmin(user.isAdmin);
      
      console.log('✅ Login successful for user:', user.email, { isAdmin: user.isAdmin });
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on user role
      if (user.isAdmin) {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/account';
      }
      
      return true;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('📝 Attempting registration with:', { name, email, apiUrl: `${API_BASE_URL}${API_ENDPOINTS.REGISTER}` });
      
      // Client-side validation
      if (!name || !email || !password) {
        toast.error('Please provide all required fields');
        return false;
      }
      
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }
      
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('✅ Registration successful for user:', user.email);
      toast.success('Registration successful!');
      return true;
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };

  const checkAuth = async (): Promise<User | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ME}`, {
        timeout: 5000
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.warn('Auth check failed:', error);
      logout();
      return null;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    loading,
    setAuthToken,
    checkAuth: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};