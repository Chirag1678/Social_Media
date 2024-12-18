import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    server: {
      proxy: {
        '/api': isProduction 
                  ? 'https://social-media-c7t8.onrender.com' 
                  : 'http://localhost:8000'
      }
    },
    plugins: [react()],
  };
});