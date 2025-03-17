import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/interactive-node-network/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    target: 'esnext'
  }
}) 