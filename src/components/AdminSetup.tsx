import React, { useState } from 'react';
import { LockKeyhole, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { setupAdminUser, testAdminLogin, createAdminUser, DEFAULT_ADMIN_CREDENTIALS } from '../utils/adminSetup';
import { enhancedAdminLogin, testBackendConnectivity } from '../utils/adminFallback';
import toast from 'react-hot-toast';

interface AdminSetupProps {
  onSetupComplete?: () => void;
}

const AdminSetup: React.FC<AdminSetupProps> = ({ onSetupComplete }) => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const handleTestLogin = async () => {
    setLoading(true);
    setTestResult({ status: 'testing', message: 'Testing admin login...' });

    try {
      const result = await testAdminLogin(
        DEFAULT_ADMIN_CREDENTIALS.email,
        DEFAULT_ADMIN_CREDENTIALS.password
      );

      if (result.success) {
        setTestResult({
          status: 'success',
          message: 'Admin login successful! User has admin privileges.'
        });
        toast.success('Admin login test successful!');
        onSetupComplete?.();
      } else {
        setTestResult({
          status: 'error',
          message: result.error || 'Admin login failed'
        });
        toast.error('Admin login test failed');
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Network error during login test'
      });
      toast.error('Network error during login test');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setLoading(true);
    setTestResult({ status: 'testing', message: 'Creating admin user...' });

    try {
      const success = await createAdminUser(DEFAULT_ADMIN_CREDENTIALS);
      
      if (success) {
        setTestResult({
          status: 'success',
          message: 'Admin user created successfully!'
        });
        toast.success('Admin user created!');
        
        // Test login after creation
        setTimeout(() => {
          handleTestLogin();
        }, 1000);
      } else {
        setTestResult({
          status: 'error',
          message: 'Failed to create admin user'
        });
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Error creating admin user'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFullSetup = async () => {
    setLoading(true);
    setTestResult({ status: 'testing', message: 'Setting up admin user...' });

    try {
      const success = await setupAdminUser();
      
      if (success) {
        setTestResult({
          status: 'success',
          message: 'Admin setup completed successfully!'
        });
        toast.success('Admin setup completed!');
        onSetupComplete?.();
      } else {
        setTestResult({
          status: 'error',
          message: 'Admin setup failed'
        });
        toast.error('Admin setup failed');
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Error during admin setup'
      });
      toast.error('Error during admin setup');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (testResult.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (testResult.status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'testing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <LockKeyhole className="h-12 w-12 text-primary-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Admin Setup & Diagnostics</h3>
        <p className="text-sm text-gray-600">
          Diagnose and fix admin authentication issues
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Default Admin Credentials:</h4>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {DEFAULT_ADMIN_CREDENTIALS.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Password:</strong> {DEFAULT_ADMIN_CREDENTIALS.password}
          </p>
        </div>

        {testResult.status !== 'idle' && (
          <div className={`p-3 rounded-lg border flex items-center space-x-2 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm">{testResult.message}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Settings className="h-4 w-4" />
            <span>Test Admin Login</span>
          </button>

          <button
            onClick={handleCreateAdmin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            <LockKeyhole className="h-4 w-4" />
            <span>Create Admin User</span>
          </button>

          <button
            onClick={handleFullSetup}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Full Admin Setup</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          This tool helps diagnose and fix admin authentication issues.
          Use "Full Admin Setup" for automatic configuration.
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
