import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: "/editor/",
  build: {
    rolupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
      '/preview': {
        target: 'http://localhost:3000',
      },
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
})
