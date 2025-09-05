import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../../config/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Fetching products...');
      const response = await makeAuthenticatedRequest('/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // Log the response for debugging
      console.log('Products API Response:', response);
      
      if (!response) {
        throw new Error('No response received from server');
      }
      
      // Handle different response formats
      let products = [];
      if (Array.isArray(response)) {
        products = response;
      } else if (response.data && Array.isArray(response.data)) {
        products = response.data;
      } else if (response.products && Array.isArray(response.products)) {
        products = response.products;
      } else {
        throw new Error('Invalid products data format');
      }
      
      console.log(`Successfully loaded ${products.length} products`);
      setProducts(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      const errorMessage = error.message || 'Failed to load products';
      setError(errorMessage);
      
      if (error.message?.includes('401') || errorMessage?.toLowerCase().includes('unauthorized')) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      console.log(`Deleting product ${productId}...`);
      const response = await makeAuthenticatedRequest(`/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response && (response.success || response.message)) {
        toast.success(response.message || 'Product deleted successfully');
        // Refresh the products list
        await fetchProducts();
      } else {
        throw new Error('Failed to delete product: Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      const errorMessage = error.message || 'Failed to delete product';
      toast.error(errorMessage);
      
      if (error.message?.includes('401') || errorMessage?.toLowerCase().includes('unauthorized')) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Product
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.images && product.images.length > 0 ? (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={product.images[0]} 
                                alt={product.name} 
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{product.category || 'Uncategorized'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stock && product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock && product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Product"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;