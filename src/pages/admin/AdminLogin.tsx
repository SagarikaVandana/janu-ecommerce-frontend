import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { enhancedAdminLogin } from '../../utils/adminFallback';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('janucollectionvizag@gmail.com');
  const [password, setPassword] = useState('janu123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First try enhanced admin login with fallback support
      const result = await enhancedAdminLogin(email, password);
      
      if (result.success && result.user) {
        setFallbackMode(result.fallbackMode || false);
        
        if (result.fallbackMode) {
          toast.success('Admin login successful (fallback mode)');
        } else {
          toast.success('Admin login successful');
        }
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        // Enhanced login failed, try regular login as fallback
        const regularSuccess = await login(email, password);
        
        if (regularSuccess) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user.isAdmin) {
            navigate('/admin/dashboard');
          } else {
            toast.error('Access denied. Admin privileges required.');
            navigate('/login');
          }
        } else {
          toast.error(result.error || 'Admin login failed');
        }
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('An unexpected error occurred during login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary-500 mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
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
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter admin email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in to Admin'}
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