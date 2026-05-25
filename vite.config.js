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
    strictPort: false
  },
  // Ensure the SPA fallback works for client-side routing
  preview: {
    port: 4173,
    host: '0.0.0.0'
  }
})
