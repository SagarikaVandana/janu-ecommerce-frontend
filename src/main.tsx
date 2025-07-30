import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Add error handling for context initialization
const AppWithProviders = () => {
  try {
    return (
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
              <Toaster position="top-right" />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  } catch (error) {
    console.error('Error initializing app:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Application Error
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Failed to initialize the application. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppWithProviders />
    </ErrorBoundary>
  </StrictMode>
);