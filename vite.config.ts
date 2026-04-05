import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy pour le développement UNIQUEMENT
    // Redirige les appels API vers le backend FastAPI
    // En production, le backend FastAPI sert directement les fichiers statiques du build
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
