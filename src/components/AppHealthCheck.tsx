import React, { useEffect, useState } from 'react';

const AppHealthCheck: React.FC = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [loadTime, setLoadTime] = useState<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    
    // Simple health check
    const checkHealth = () => {
      try {
        // Check if DOM is ready
        if (document.readyState === 'complete') {
          const endTime = performance.now();
          const loadDuration = Math.round(endTime - startTime);
          setLoadTime(loadDuration);
          setIsHealthy(true);
          console.log(`✅ App loaded successfully in ${loadDuration}ms`);
        } else {
          // Wait for DOM to be ready
          setTimeout(checkHealth, 100);
        }
      } catch (error) {
        console.error('❌ Health check failed:', error);
        setIsHealthy(false);
      }
    };

    checkHealth();
  }, []);

  // Only show in development or if there's an issue
  if (import.meta.env.MODE === 'development' || !isHealthy) {
    return (
      <div className="fixed top-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs z-50">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isHealthy ? 'Healthy' : 'Unhealthy'}</span>
          {loadTime > 0 && <span>({loadTime}ms)</span>}
        </div>
      </div>
    );
  }

  return null;
};

export default AppHealthCheck; 