import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { safeMap, isArrayWithItems } from '../utils/arrayUtils';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  if (!isArrayWithItems(cartItems)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some products to your cart to get started!</p>
          <Link
            to="/products"
            className="btn-primary"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="space-y-6">
        {safeMap(cartItems, (item, index) => (
          <motion.div
            key={`${item._id}-${item.size}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                  className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 border border-gray-300 rounded-md min-w-[2.5rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                  className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(item._id, item.size)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 card p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-600">Items ({getTotalItems()})</span>
            <span className="text-lg font-semibold">₹{getTotalPrice()}</span>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{getTotalPrice()}
              </span>
            </div>
          </div>
          
          <div className="pt-4">
            <Link
              to="/checkout"
              className="w-full btn-primary block text-center py-3"
            >
              Proceed to Checkout
            </Link>
          </div>
          
          <div className="text-center">
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;