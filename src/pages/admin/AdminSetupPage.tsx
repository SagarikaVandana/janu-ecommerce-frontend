import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSetup from '../../components/AdminSetup';

const AdminSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSetupComplete = () => {
    // Redirect to admin login after successful setup
    setTimeout(() => {
      navigate('/admin/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Admin Setup & Diagnostics
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Fix admin authentication issues for Janu Collections
          </p>
        </div>
        
        <AdminSetup onSetupComplete={handleSetupComplete} />
        
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/admin/login')}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            ← Back to Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetupPage;
