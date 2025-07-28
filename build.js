#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Vercel build process...');

try {
  // Ensure we're in the right directory
  console.log('📁 Current directory:', process.cwd());
  
  // Check if node_modules exists
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Try to fix permissions
  const vitePath = path.join(nodeModulesPath, '.bin', 'vite');
  if (fs.existsSync(vitePath)) {
    try {
      fs.chmodSync(vitePath, '755');
      console.log('✅ Fixed vite permissions');
    } catch (error) {
      console.log('⚠️ Could not fix vite permissions:', error.message);
    }
  }
  
  // Run the build
  console.log('🔨 Running build...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 