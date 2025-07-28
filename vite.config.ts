import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://janu-ecommerce-backend.onrender.com'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});