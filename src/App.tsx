import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Payment = lazy(() => import('./pages/Payment'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'));
const AdminPaymentSettings = lazy(() => import('./pages/admin/AdminPaymentSettings'));
const AdminSetupPage = lazy(() => import('./pages/admin/AdminSetupPage'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

// Admin routes wrapper
const AdminRoutes = () => (
  <ProtectedRoute adminOnly>
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="newsletter" element={<AdminNewsletter />} />
        <Route path="payment-settings" element={<AdminPaymentSettings />} />
        <Route path="setup" element={<AdminSetupPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public routes */}
              <Route element={<MainLayout>{''}</MainLayout>}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                
                {/* Protected user routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Admin auth routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin protected routes */}
              <Route path="/admin/*" element={<AdminRoutes />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products">
            <Route index element={<AdminProducts />} />
            <Route path="new" element={<AddProduct />} />
          </Route>
                <Route path="orders" element={<AdminOrders />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="payment-settings" element={<AdminPaymentSettings />} />
                <Route path="setup" element={<AdminSetupPage />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;