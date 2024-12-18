import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    server: {
      proxy: {
        '/api': isDevelopment
                  ? 'http://localhost:8000'
                  : 'https://social-media-c7t8.onrender.com' 
      }
    },
    plugins: [react()],
  };
});