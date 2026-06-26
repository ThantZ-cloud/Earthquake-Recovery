import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // In production, VITE_API_URL env var tells the frontend where the backend is
  // e.g., VITE_API_URL=https://earthquake-api.onrender.com
})
