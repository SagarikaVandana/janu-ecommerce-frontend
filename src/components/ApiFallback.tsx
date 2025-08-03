import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { API_BASE_URL, checkApiHealth } from '../config/api';

interface ApiFallbackProps {
  onRetry?: () => void;
  message?: string;
  showDebugInfo?: boolean;
}

const ApiFallback: React.FC<ApiFallbackProps> = ({ 
  onRetry, 
  message = "We're experiencing some technical difficulties. Please try again later.",
  showDebugInfo = true
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleRetry = async () => {
    if (onRetry) {
      onRetry();
    }
  };

  const checkApiStatus = async () => {
    setIsChecking(true);
    try {
      const isHealthy = await checkApiHealth();
      setDebugInfo({
        apiUrl: API_BASE_URL,
        isHealthy,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        environment: import.meta.env.MODE
      });
    } catch (error) {
      setDebugInfo({
        apiUrl: API_BASE_URL,
        isHealthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        environment: import.meta.env.MODE
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Service Temporarily Unavailable
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>
        
        {/* Debug Information */}
        {showDebugInfo && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Debug Information</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>API URL:</strong> {API_BASE_URL}</div>
              <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
              <div><strong>Timestamp:</strong> {new Date().toLocaleString()}</div>
            </div>
            <button
              onClick={checkApiStatus}
              disabled={isChecking}
              className="mt-3 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 disabled:opacity-50"
            >
              {isChecking ? 'Checking...' : 'Check API Status'}
            </button>
            {debugInfo && (
              <div className="mt-3 p-2 bg-white rounded border text-xs">
                <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          )}
          <Link
            to="/contact"
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Contact Support</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApiFallback; 