import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/interactive-node-network/',
  build: {
    minify: 'esbuild',
    target: 'esnext',  // Modern browsers for better optimization
    cssCodeSplit: true,  // Enable CSS code splitting
    reportCompressedSize: false,  // Skip reporting compressed size for faster builds
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['react-colorful']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-colorful'],
    esbuildOptions: {
      target: 'esnext',
      drop: ['console', 'debugger']  // Remove console.log and debugger statements
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],  // Also drop console.log and debugger in source code
    target: 'esnext'
  }
}) 