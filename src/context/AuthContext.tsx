import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        timeout: 5000 // Add timeout
      });
      setUser(response.data);
    } catch (error) {
      console.warn('Failed to fetch user:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      // Don't throw error, just set loading to false
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      console.log('API URL:', `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`);
      
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, 
        { email, password },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Login response:', response.data);
      const { token, user } = response.data;
      
      if (!token || !user) {
        console.error('Invalid response format: missing token or user');
        toast.error('Invalid response from server');
        return false;
      }
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('Login successful for user:', user._id);
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', email);
      console.log('API URL:', `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`);
      
      // Client-side validation
      if (!name || !email || !password) {
        toast.error('All fields are required');
        return false;
      }
      
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }
      
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, 
        { name, email, password },
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Registration response:', response.data);
      const { token, user } = response.data;
      
      if (!token || !user) {
        console.error('Invalid response format: missing token or user');
        toast.error('Invalid response from server');
        return false;
      }
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('Registration successful for user:', user._id);
      toast.success('Registration successful!');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};