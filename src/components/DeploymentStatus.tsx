import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Info } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, checkApiHealth } from '../config/api';

interface DeploymentStatusProps {
  showDetails?: boolean;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ showDetails = false }) => {
  const [status, setStatus] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkDeploymentStatus = async () => {
    setIsChecking(true);
    
    const deploymentStatus = {
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      apiUrl: API_BASE_URL,
      checks: {
        environmentVariables: {
          VITE_API_URL: import.meta.env.VITE_API_URL ? 'Set' : 'Missing',
          VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing',
          VITE_WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER ? 'Set' : 'Missing',
          VITE_INSTAGRAM_URL: import.meta.env.VITE_INSTAGRAM_URL ? 'Set' : 'Missing',
          VITE_FACEBOOK_URL: import.meta.env.VITE_FACEBOOK_URL ? 'Set' : 'Missing',
          VITE_YOUTUBE_URL: import.meta.env.VITE_YOUTUBE_URL ? 'Set' : 'Missing',
          NODE_ENV: import.meta.env.NODE_ENV || 'Not set'
        },
        apiHealth: 'Checking...',
        productsEndpoint: 'Checking...',
        backendConnectivity: 'Checking...'
      }
    };

    try {
      // Check API health
      const isHealthy = await checkApiHealth();
      deploymentStatus.checks.apiHealth = isHealthy ? 'Healthy' : 'Unhealthy';
      deploymentStatus.checks.backendConnectivity = isHealthy ? 'Connected' : 'Failed';

      // Check products endpoint
      if (isHealthy) {
        try {
          const response = await axios.get(`${API_BASE_URL}/products?limit=1`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          deploymentStatus.checks.productsEndpoint = response.data ? 'Working' : 'Failed';
        } catch (error) {
          deploymentStatus.checks.productsEndpoint = 'Failed';
          console.error('Error checking products endpoint:', error);
        }
      } else {
        deploymentStatus.checks.productsEndpoint = 'Skipped (API unhealthy)';
      }
    } catch (error) {
      deploymentStatus.checks.apiHealth = 'Error';
      deploymentStatus.checks.backendConnectivity = 'Error';
      deploymentStatus.checks.productsEndpoint = 'Error';
    }

    setStatus(deploymentStatus);
    setIsChecking(false);
  };

  useEffect(() => {
    if (showDetails) {
      checkDeploymentStatus();
    }
  }, [showDetails]);

  if (!showDetails) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Set':
      case 'Healthy':
      case 'Working':
      case 'Connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Missing':
      case 'Unhealthy':
      case 'Failed':
      case 'Error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Checking...':
      case 'Skipped (API unhealthy)':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Deployment Status</h3>
        <button
          onClick={checkDeploymentStatus}
          disabled={isChecking}
          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50 flex items-center space-x-1"
        >
          <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking...' : 'Refresh'}</span>
        </button>
      </div>
      
      {status && (
        <div className="text-xs space-y-3">
          <div className="flex items-center space-x-2">
            <Info className="h-3 w-3 text-blue-600" />
            <span className="text-gray-600">Environment: {status.environment}</span>
          </div>
          
          <div className="space-y-2">
            <div className="font-medium text-gray-700">Environment Variables:</div>
            {Object.entries(status.checks.environmentVariables).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                {getStatusIcon(String(value))}
                <span className="text-gray-600">{key}:</span>
                <span className="text-gray-800">{String(value)}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="font-medium text-gray-700">API Status:</div>
            {Object.entries(status.checks).filter(([key]) => key !== 'environmentVariables').map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                {getStatusIcon(String(value))}
                <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <span className="text-gray-800">{String(value)}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="font-medium text-gray-700">API URL:</div>
            <div className="text-gray-800 font-mono break-all text-xs">
              {status.apiUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentStatus; 