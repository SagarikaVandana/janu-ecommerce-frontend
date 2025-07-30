import React from 'react';

const DebugInfo: React.FC = () => {
  const debugInfo = {
    nodeEnv: import.meta.env.MODE,
    apiUrl: import.meta.env.VITE_API_URL || 'Not set',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    location: window.location.href,
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Debug Info</h4>
      <div className="space-y-1">
        <div><strong>Mode:</strong> {debugInfo.nodeEnv}</div>
        <div><strong>API URL:</strong> {debugInfo.apiUrl}</div>
        <div><strong>Time:</strong> {debugInfo.timestamp}</div>
        <div><strong>URL:</strong> {debugInfo.location}</div>
      </div>
    </div>
  );
};

export default DebugInfo; 