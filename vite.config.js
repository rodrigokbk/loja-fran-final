import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Em dev, redireciona /api para o backend local
      '/api': 'http://localhost:3000',
    },
  },
})
