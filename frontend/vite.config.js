import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: false,
    proxy: {
      // All /api/* requests are forwarded to Flask during development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0'
  }
})
