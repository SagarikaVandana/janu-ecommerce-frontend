import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Products: React.FC = () => {
  const { category } = useParams();

  console.log('Products component rendering - simplified version');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'All Products'}
          </h1>
          <p className="text-xl text-gray-600">
            Discover our amazing collection of products
          </p>
        </div>

        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
          <p className="text-gray-600 mb-4">Check back soon for our latest collection!</p>
        </div>
      </div>
    </div>
  );
};

export default Products;