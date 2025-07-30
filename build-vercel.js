#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

// Ensure environment variables are set
const envVars = {
  VITE_API_URL: 'https://janu-ecommerce-backend.onrender.com/api',
  VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_publishable_key_here',
  VITE_WHATSAPP_NUMBER: '+919391235258',
  VITE_INSTAGRAM_URL: 'https://www.instagram.com/janucollectionvizag/',
  VITE_FACEBOOK_URL: 'https://www.facebook.com/janucollectionvizag',
  VITE_YOUTUBE_URL: 'https://www.youtube.com/@Janucollectionvizag',
  NODE_ENV: 'production'
};

// Set environment variables
Object.entries(envVars).forEach(([key, value]) => {
  process.env[key] = value;
  console.log(`✅ Set ${key}=${value}`);
});

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the project
  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
} 