import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import axios from 'axios';

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    salesData: [],
    userGrowth: [],
    topProducts: [],
    revenueByMonth: [],
    orderStatus: {},
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/analytics?timeRange=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into your business performance</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{analytics.totalRevenue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{analytics.averageOrderValue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Sales chart will be displayed here</p>
              <p className="text-sm text-gray-500">Chart integration coming soon</p>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Growth</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">User growth chart will be displayed here</p>
              <p className="text-sm text-gray-500">Chart integration coming soon</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
          {analytics.topProducts && analytics.topProducts.length > 0 ? (
            <div className="space-y-3">
              {analytics.topProducts.slice(0, 5).map((product: any, index: number) => (
                <div key={product._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">#{index + 1}</span>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{product.sales || 0} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No product data available</p>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
          {analytics.orderStatus && Object.keys(analytics.orderStatus).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(analytics.orderStatus).map(([status, count]: [string, any]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize font-medium text-gray-900">{status}</span>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No order status data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 