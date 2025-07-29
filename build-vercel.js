#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Vercel build process...');

try {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  const binPath = path.join(nodeModulesPath, '.bin');
  
  // Fix permissions for all binaries
  if (fs.existsSync(binPath)) {
    console.log('🔧 Fixing permissions for all binaries...');
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
  
  // Run the build using npx
  console.log('🔨 Running build with npx...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 