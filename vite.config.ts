import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'https://9248-2405-9800-b910-7bf-bdbe-c9b3-40a5-9109.ngrok-free.app',
        changeOrigin: true,
      }
    }
  }
})