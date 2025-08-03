import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppContact from './components/WhatsAppContact';
import LoadingSpinner from './components/LoadingSpinner';
import AppHealthCheck from './components/AppHealthCheck';
import EnvironmentCheck from './components/EnvironmentCheck';
import DeploymentStatus from './components/DeploymentStatus';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPaymentSettings from './pages/admin/AdminPaymentSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReports from './pages/admin/AdminReports';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 App component initializing...');
    
    try {
      // Reduced loading time to prevent infinite loading
      const timer = setTimeout(() => {
        console.log('✅ App initialization complete');
        setIsLoading(false);
      }, 200); // Further reduced to 200ms

      return () => {
        console.log('🧹 Cleaning up App component...');
        clearTimeout(timer);
      };
    } catch (error) {
      console.error('❌ Error during app initialization:', error);
      setInitError(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  // Handle initialization errors
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Initialization Error
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {initError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading Janu Collections..." />;
  }

  console.log('🎨 Rendering main app content...');

  return (
    <div className="min-h-screen flex flex-col">
      <AppHealthCheck />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          
          {/* Protected Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/payment/:orderId" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/payment-settings" element={
            <AdminRoute>
              <AdminPaymentSettings />
            </AdminRoute>
          } />
          <Route path="/admin/newsletter" element={
            <AdminRoute>
              <AdminNewsletter />
            </AdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <WhatsAppContact variant="floating" />
      {/* Show environment check in development or when there are issues */}
      <EnvironmentCheck showDetails={import.meta.env.MODE === 'development' || import.meta.env.VITE_DEBUG === 'true'} />
      {/* Show deployment status for debugging */}
      <DeploymentStatus showDetails={import.meta.env.MODE === 'development' || import.meta.env.VITE_DEBUG === 'true'} />
    </div>
  );
}

export default App;