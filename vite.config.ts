import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import packageJson from './package.json';

export default defineConfig({
  plugins: [react()],
  define: {
    'APP_VERSION': JSON.stringify(packageJson.version),
  },
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
