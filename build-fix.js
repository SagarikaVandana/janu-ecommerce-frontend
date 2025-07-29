#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing permissions for Vercel build...');

try {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  const binPath = path.join(nodeModulesPath, '.bin');
  
  if (fs.existsSync(binPath)) {
    console.log('📁 Found .bin directory, fixing permissions...');
    
    // Fix permissions for all files in .bin directory
    const files = fs.readdirSync(binPath);
    files.forEach(file => {
      const filePath = path.join(binPath, file);
      try {
        fs.chmodSync(filePath, '755');
        console.log(`✅ Fixed permissions for: ${file}`);
      } catch (error) {
        console.log(`⚠️ Could not fix permissions for: ${file}`);
      }
    });
  }
  
  console.log('🚀 Running build command...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 