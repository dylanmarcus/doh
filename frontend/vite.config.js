import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['fsevents']
    }
  },
  optimizeDeps: {
    exclude: ['fsevents']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});