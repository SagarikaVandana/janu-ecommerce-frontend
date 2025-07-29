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
  
  // Fix permissions for all binaries in .bin directory
  const binPath = path.join(nodeModulesPath, '.bin');
  if (fs.existsSync(binPath)) {
    console.log('🔧 Fixing permissions for binaries...');
    try {
      const files = fs.readdirSync(binPath);
      files.forEach(file => {
        const filePath = path.join(binPath, file);
        try {
          fs.chmodSync(filePath, '755');
          console.log(`✅ Fixed permissions for ${file}`);
        } catch (error) {
          console.log(`⚠️ Could not fix permissions for ${file}:`, error.message);
        }
      });
    } catch (error) {
      console.log('⚠️ Could not read .bin directory:', error.message);
    }
  }
  
  // Alternative approach: use npx to run vite
  console.log('🔨 Running build with npx...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ npx vite build failed, trying direct vite command...');
    // Try running vite directly from node_modules
    const vitePath = path.join(nodeModulesPath, '.bin', 'vite');
    if (fs.existsSync(vitePath)) {
      execSync(`node ${vitePath} build`, { stdio: 'inherit' });
    } else {
      throw new Error('Vite binary not found');
    }
  }
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 