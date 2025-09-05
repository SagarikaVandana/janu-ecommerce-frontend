import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { enhancedAdminLogin } from '../../utils/adminFallback';

// Initialize toast dynamically to avoid SSR issues
let toast: any;
if (typeof window !== 'undefined') {
  import('react-hot-toast').then((module) => {
    toast = module.toast;
  }).catch(console.error);
}

// Safe toast function that won't throw if toast is not available
const safeToast = {
  success: (message: string) => {
    if (typeof window !== 'undefined') {
      if (toast?.success) {
        toast.success(message);
      } else {
        console.log(`[Success] ${message}`);
      }
    }
  },
  error: (message: string) => {
    if (typeof window !== 'undefined') {
      if (toast?.error) {
        toast.error(message);
      } else {
        console.error(`[Error] ${message}`);
      }
    }
  }
};

interface EnhancedLoginResult {
  success: boolean;
  user?: {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  };
  token?: string;
  error?: string;
  fallbackMode?: boolean;
}

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: 'janucollectionvizag@gmail.com',
    password: 'janu123',
    showPassword: false
  });
  const [loginError, setLoginError] = useState('');
  const [fallbackMode, setFallbackMode] = useState(false);
  const { login, isAuthenticated, isAdmin, setAuthToken } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setFormData(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    
    try {
      // First try enhanced admin login with fallback support
      const result = await enhancedAdminLogin(formData.email, formData.password) as EnhancedLoginResult;
      
      if (result?.success && result.user && result.token) {
        if (result.fallbackMode) {
          setFallbackMode(true);
          safeToast.success('Admin login successful (fallback mode)');
        } else {
          safeToast.success('Admin login successful');
        }
        
        // Use the auth context to set the token and user
        setAuthToken(result.token, result.user);
        
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
        return;
      }
      
      // If we get here, enhanced login failed - try regular login with admin flag
      const loginSuccess = await login(formData.email, formData.password, true);
      
      if (loginSuccess) {
        // Successful login will redirect via the AuthProvider's useEffect
        return;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to login. Please try again.';
      setLoginError(errorMessage);
      safeToast.error(errorMessage);
      
      // Clear sensitive data on error
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <LockKeyhole className="h-12 w-12 text-primary-500 mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          {loginError && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center justify-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {loginError}
            </div>
          )}
          <p className="mt-2 text-sm text-gray-600">
            Access the admin dashboard
          </p>
          {fallbackMode && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Fallback Mode Active</span>
            </div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={formData.showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {formData.showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in to Admin'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Having trouble logging in?{' '}
            <button
              onClick={() => navigate('/admin/setup')}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Run Admin Setup & Diagnostics
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;