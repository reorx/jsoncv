import { resolve } from 'path';
import { defineConfig } from 'vite';

const sampleFilename = './sample.resume.json'
let dataFilename = process.env.DATA_FILENAME || sampleFilename

const data = require(dataFilename)

const rootDir = resolve(__dirname, 'src')

export default defineConfig({
  // use relative path for assets
  // base: "",
  root: 'src',
  build: {
    // put assets in the same folder as index.html
    // assetsDir: ".",
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        editor: resolve(rootDir, 'editor/index.html'),
      },
    },
  },
  plugins: [
  ],
})
