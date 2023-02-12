import { resolve } from 'path';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { viteSingleFile } from 'vite-plugin-singlefile';

import { TransformEjs } from './src/lib/vite-plugins';
import { getRenderData } from './src/themes/data';

const dataFilename = process.env.DATA_FILENAME || './sample.cv.json'
const outDir = process.env.OUT_DIR || 'dist'

const data = require(dataFilename)
const renderData = getRenderData(data)
renderData.theme = process.env.THEME || 'reorx'
renderData.isProduction = process.env.NODE_ENV === 'production'
renderData.meta = {
  title: data.basics.name,
  description: data.basics.summary.replace('\n', ' '),
}


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
      renderData,
      {
        ejs: (viteConfig) => ({
          // ejs options goes here.
          views: [resolve(__dirname)],
        })
      }
    ),
    viteSingleFile(),
  ],
})
