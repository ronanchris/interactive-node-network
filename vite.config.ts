import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || '/interactive-node-network/',
  server: {
    watch: {
      // Don't watch node_modules
      ignored: ['**/node_modules/**', '**/docs/status/**'],
      // Reduce file system events
      usePolling: false,
      interval: 1000,
    },
    // Reduce HMR frequency
    hmr: {
      overlay: false,
      // Increase HMR timeout
      timeout: 5000,
    }
  },
  // Optimize build settings
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Reduce disk writes during development
    write: true,
    // Minimize CSS extraction
    cssCodeSplit: false,
    // Reduce source map generation
    sourcemap: false,
    minify: 'terser',
    target: 'esnext',  // Modern browsers for better optimization
    reportCompressedSize: false,  // Skip reporting compressed size for faster builds
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-colorful']
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