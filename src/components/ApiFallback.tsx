import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';

interface ApiFallbackProps {
  onRetry?: () => void;
  message?: string;
}

const ApiFallback: React.FC<ApiFallbackProps> = ({ 
  onRetry, 
  message = "We're experiencing some technical difficulties. Please try again later." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
          <RefreshCw className="h-6 w-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Service Temporarily Unavailable
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
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