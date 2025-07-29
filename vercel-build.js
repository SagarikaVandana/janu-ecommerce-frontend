#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Vercel-specific build process...');

// Function to fix permissions recursively
function fixPermissions(dir) {
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        fixPermissions(fullPath);
      } else {
        // Make all files executable
        try {
          fs.chmodSync(fullPath, '755');
          console.log(`✅ Fixed permissions for: ${fullPath}`);
        } catch (error) {
          console.log(`⚠️ Could not fix permissions for: ${fullPath}`);
        }
      }
    });
  } catch (error) {
    console.log(`⚠️ Error reading directory ${dir}:`, error.message);
  }
}

// Function to run command with better error handling
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔨 Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    console.log('📁 Current directory:', process.cwd());
    console.log('🔧 Node version:', process.version);
    
    // Check if node_modules exists
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('📦 Installing dependencies...');
      await runCommand('npm', ['install']);
    }
    
    // Aggressively fix permissions for all binaries
    console.log('🔧 Fixing permissions for all binaries...');
    const binPath = path.join(nodeModulesPath, '.bin');
    if (fs.existsSync(binPath)) {
      fixPermissions(binPath);
    }
    
    // Also fix permissions for the entire node_modules directory
    console.log('🔧 Fixing permissions for node_modules...');
    fixPermissions(nodeModulesPath);
    
    // Try multiple build approaches
    const buildAttempts = [
      {
        name: 'npx vite build',
        command: 'npx',
        args: ['vite', 'build']
      },
      {
        name: 'direct vite command',
        command: 'node',
        args: [path.join(binPath, 'vite'), 'build']
      },
      {
        name: 'npm run build:direct',
        command: 'npm',
        args: ['run', 'build:direct']
      },
      {
        name: 'yarn build',
        command: 'yarn',
        args: ['build']
      }
    ];
    
    for (const attempt of buildAttempts) {
      try {
        console.log(`🔄 Attempting: ${attempt.name}`);
        await runCommand(attempt.command, attempt.args);
        console.log(`✅ Build completed successfully with: ${attempt.name}`);
        return;
      } catch (error) {
        console.log(`❌ Failed: ${attempt.name} - ${error.message}`);
        // Continue to next attempt
      }
    }
    
    throw new Error('All build attempts failed');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

main(); 