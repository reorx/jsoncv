import { resolve } from 'path';
import { defineConfig } from 'vite';

import { TransformEjs } from './src/lib/vite-plugins';

const rootDir = resolve(__dirname, 'src')

export default defineConfig({
  root: 'src',
  build: {
    // allows 'import.meta.glob' to work
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        editor: resolve(rootDir, 'editor/index.html'),
        preview: resolve(rootDir, 'preview/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      // remove the "Module "fs" has been externalized" warning for ejs
      'fs': 'src/lib/fs-polyfill.js',
    },
  },
  plugins: [
    TransformEjs(),
  ],
})
