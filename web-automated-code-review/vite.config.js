// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'), // Resolving the @ symbol to src folder
//     },
//   },
// });


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   mode: 'development',
//   build: {
//     outDir: path.resolve(__dirname, 'static'),  // Change output directory to 'static'
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'), // Resolving the @ symbol to src folder
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  mode: 'development',
  build: {
    outDir: path.resolve(__dirname, 'static'),  // Change output directory to 'static'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Resolving the @ symbol to src folder
    },
  },
  server: {
    proxy: {
      '/upload': {
        target: 'http://127.0.0.1:8000',  // Backend API server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

