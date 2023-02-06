import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { viteSingleFile } from 'vite-plugin-singlefile';

import { TransformEjs } from './src/lib/vite-plugins';
import { getRenderData } from './src/themes/data';

const dataFilename = process.env.DATA_FILENAME || './sample.resume.json'
const outDir = process.env.OUT_DIR || 'dist'

const cvData = require(dataFilename)
const data = getRenderData(cvData)
data.theme = process.env.THEME || 'reorx'
data.isProduction = process.env.NODE_ENV === 'production'


export default defineConfig({
  build: {
    outDir: outDir,
  },
  resolve: {
    alias: {
      // remove the "Module "fs" has been externalized" warning for ejs
      'fs': 'src/lib/fs-polyfill.js',
    },
  },
  plugins: [
    TransformEjs(),
    ViteEjsPlugin(
      data,
      {
        ejs: (viteConfig) => ({
          // ejs options goes here.
          views: [__dirname],
        })
      }
    ),
    viteSingleFile(),
  ],
})
