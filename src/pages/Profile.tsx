import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Package, Truck, MapPin as MapPinIcon, Lock, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [accountStats, setAccountStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: '',
  });
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchAccountStats();
    fetchUserProfile();
  }, []);

  const fetchAccountStats = async () => {
    try {
      console.log('Fetching account stats for user:', user?.email);
      const response = await axios.get('/api/orders/user-stats');
      console.log('Account stats response:', response.data);
      
      setAccountStats({
        totalOrders: response.data.totalOrders || 0,
        totalSpent: response.data.totalSpent || 0,
        memberSince: response.data.memberSince || 'Jan 2024',
      });
    } catch (error: any) {
      console.error('Error fetching account stats:', error);
      console.error('Error response:', error.response?.data);
      
      // Set default values if API fails
      setAccountStats({
        totalOrders: 0,
        totalSpent: 0,
        memberSince: 'Jan 2024',
      });
      
      // Show error toast only if it's not a network error
      if (error.response?.status !== 404) {
        toast.error('Failed to load account statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      const userData = response.data;
      setProfileData({
        name: userData.name || user?.name || '',
        email: userData.email || user?.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        pincode: userData.pincode || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put('/api/users/profile', profileData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'orders':
        navigate('/orders');
        break;
      case 'track':
        navigate('/orders');
        break;
      case 'addresses':
        // Enable editing mode for address fields
        setIsEditing(true);
        toast.success('Address editing enabled. Click "Save Changes" when done.');
        break;
      case 'password':
        setShowPasswordModal(true);
        break;
      default:
        break;
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      await axios.put('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="Enter address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Enter state"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={profileData.pincode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-6 flex space-x-4">
                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('orders')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
              >
                <Package className="h-4 w-4 text-primary-500" />
                <span>View Order History</span>
              </button>
              <button 
                onClick={() => handleQuickAction('track')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
              >
                <Truck className="h-4 w-4 text-primary-500" />
                <span>Track Orders</span>
              </button>
              <button 
                onClick={() => handleQuickAction('addresses')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
              >
                <MapPinIcon className="h-4 w-4 text-primary-500" />
                <span>Manage Addresses</span>
              </button>
              <button 
                onClick={() => handleQuickAction('password')}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
              >
                <Lock className="h-4 w-4 text-primary-500" />
                <span>Change Password</span>
              </button>
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
                <div className="animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Total Orders</span>
                  </span>
                  <span className="font-semibold">{accountStats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Total Spent</span>
                  </span>
                  <span className="font-semibold">₹{accountStats.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member Since</span>
                  </span>
                  <span className="font-semibold">{accountStats.memberSince}</span>
                </div>
                
                {accountStats.totalOrders === 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                      🛍️ No orders yet! Start shopping to see your order history here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Change Password
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;