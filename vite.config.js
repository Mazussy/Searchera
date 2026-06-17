import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Proxy API requests to the backend during development to avoid CORS.
    proxy: {
      "/api": {
        target: "https://searchera26-001-site1.gtempurl.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})