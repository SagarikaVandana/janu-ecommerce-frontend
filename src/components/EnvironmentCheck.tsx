import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface EnvironmentCheckProps {
  showDetails?: boolean;
}

const EnvironmentCheck: React.FC<EnvironmentCheckProps> = ({ showDetails = false }) => {
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkEnvironment = () => {
    setIsChecking(true);
    
    const status = {
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      variables: {
        VITE_API_URL: import.meta.env.VITE_API_URL || 'Not set',
        VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Not set',
        VITE_WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || 'Not set',
        VITE_INSTAGRAM_URL: import.meta.env.VITE_INSTAGRAM_URL || 'Not set',
        VITE_FACEBOOK_URL: import.meta.env.VITE_FACEBOOK_URL || 'Not set',
        VITE_YOUTUBE_URL: import.meta.env.VITE_YOUTUBE_URL || 'Not set',
        NODE_ENV: import.meta.env.NODE_ENV || 'Not set'
      },
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled
      },
      location: {
        href: window.location.href,
        origin: window.location.origin,
        pathname: window.location.pathname
      }
    };

    setEnvStatus(status);
    setIsChecking(false);
  };

  useEffect(() => {
    checkEnvironment();
  }, []);

  if (!showDetails) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Environment Check</h3>
        <button
          onClick={checkEnvironment}
          disabled={isChecking}
          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      {envStatus && (
        <div className="text-xs space-y-2">
          <div className="flex items-center space-x-2">
            <Info className="h-3 w-3 text-blue-600" />
            <span className="text-gray-600">Environment: {envStatus.environment}</span>
          </div>
          
          <div className="space-y-1">
            <div className="font-medium text-gray-700">Environment Variables:</div>
            {Object.entries(envStatus.variables).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                {value === 'Not set' ? (
                  <XCircle className="h-3 w-3 text-red-500" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                <span className="text-gray-600">{key}:</span>
                <span className="text-gray-800 font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="font-medium text-gray-700">API URL:</div>
            <div className="text-gray-800 font-mono break-all">
              {envStatus.variables.VITE_API_URL}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentCheck; 