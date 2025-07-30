import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const HealthCheck: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      console.log('Checking API health at:', `${API_BASE_URL}${API_ENDPOINTS.HEALTH}`);
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`, {
        timeout: 5000
      });
      console.log('Health check response:', response.data);
      setHealthStatus('healthy');
      setError('');
    } catch (err: any) {
      console.error('Health check failed:', err);
      setHealthStatus('unhealthy');
      setError(err.message || 'API connection failed');
    }
  };

  if (healthStatus === 'checking') {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
          <span>Checking API connection...</span>
        </div>
      </div>
    );
  }

  if (healthStatus === 'unhealthy') {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        <div className="flex items-center justify-between">
          <div>
            <strong>API Connection Failed</strong>
            <div className="text-sm">{error}</div>
          </div>
          <button 
            onClick={checkHealth}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
        <span>API Connected</span>
      </div>
    </div>
  );
};

export default HealthCheck; 