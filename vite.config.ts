import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

// Function to copy _redirects file to dist
export function copyRedirectsFile() {
  return {
    name: 'copy-redirects',
    closeBundle() {
      const src = resolve(__dirname, 'public/_redirects');
      const dest = resolve(__dirname, 'dist/_redirects');
      
      if (existsSync(src)) {
        // Ensure dist directory exists
        const distDir = resolve(__dirname, 'dist');
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true });
        }
        
        // Copy _redirects file
        copyFileSync(src, dest);
        console.log('✅ Copied _redirects file to dist directory');
      } else {
        console.warn('⚠️ _redirects file not found in public directory');
      }
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    copyRedirectsFile()
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'framer-motion']
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Ensure _redirects is copied to the root of the output directory
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    host: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  envPrefix: 'VITE_',
  // Ensure public files are copied as-is
  publicDir: 'public',
  // Enable client-side routing
  base: ''
});