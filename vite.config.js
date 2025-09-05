import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
      // Proxy API requests to your backend
      '/api': {
        target: 'https://janu-ecommerce-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // This ensures the base path is correct for production
  base: '/',
  build: {
    outDir: 'dist',
    // This ensures the _redirects file is copied to the dist folder
    assetsDir: '.',
    // This enables code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'framer-motion'],
        },
      },
    },
  },
});
