import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/interactive-node-network/',
  build: {
    minify: 'esbuild',
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
    include: ['react', 'react-dom', 'react-colorful']
  }
}) 