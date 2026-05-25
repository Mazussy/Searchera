import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),  // ← remove the babel config entirely
    tailwindcss(),
  ],
  server: {
    // Proxy API requests to the backend during development to avoid CORS.
    proxy: {
      "/api": {
        target: "https://searchera-001-site1.rtempurl.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})