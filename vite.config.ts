import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/oauth': {
        target: 'https://oauth.fatsecret.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oauth/, ''),
      },
      '/fatsecret': {
        target: 'https://platform.fatsecret.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fatsecret/, ''),
      },
    },
  },
});
