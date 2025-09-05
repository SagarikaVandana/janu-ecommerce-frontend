import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, ShoppingBag, BarChart3, FileText, Mail, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Newsletter', path: '/admin/newsletter', icon: Mail },
    { name: 'Payment Settings', path: '/admin/payment-settings', icon: CreditCard },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white border-r border-gray-200">
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-left text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
              <button className="p-1 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
              <Outlet />
            </main>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
