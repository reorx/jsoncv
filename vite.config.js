import { resolve } from 'path';
import { defineConfig } from 'vite';

const sampleFilename = './sample.resume.json'
let dataFilename = process.env.DATA_FILENAME || sampleFilename

const data = require(dataFilename)

const rootDir = resolve(__dirname, 'src')

const fileRegex = /\.(my-file-ext)$/

// ref 1: https://vitejs.dev/guide/api-plugin.html#transforming-custom-file-types
// ref 2: https://github.com/vitejs/vite/issues/594#issuecomment-665915643
function TransformEjs() {
  return {
    name: 'transform-ejs',

    transform(src, id) {
      if (id.endsWith('.ejs')) {
        return {
          code: `export default ${JSON.stringify(src)}`,
          map: null, // provide source map if available
        }
      }
    },
  }
}


export default defineConfig({
  // use relative path for assets
  // base: "",
  root: 'src',
  // assetsInclude: ['**/*.ejs'],
  build: {
    // relative to root
    outDir: "../dist",
    // put assets in the same folder as index.html
    // assetsDir: ".",
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        editor: resolve(rootDir, 'editor/index.html'),
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
