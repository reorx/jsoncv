import { defineConfig } from 'vite';

import { TransformEjs } from './src/lib/vite-plugins';

export default defineConfig({
  root: 'src',
  build: {
    // allows 'import.meta.glob' to work
    target: 'esnext',
    rollupOptions: {
      input: {
        main: 'index.html',
        editor: 'editor/index.html',
        preview: 'preview/index.html',
        // main: resolve(rootDir, 'index.html'),
        // editor: resolve(rootDir, 'editor/index.html'),
        // editorPreview: resolve(rootDir, 'editor/preview.html'),
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
