import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  mode: 'development',
  build: {
    outDir: 'dist',  // ✅ Correct: Build output goes to 'dist', not 'static'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Keep this for clean imports
    },
  },
  server: {
    proxy: {
      '/upload': {
        target: 'http://127.0.0.1:8000', // Local backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
