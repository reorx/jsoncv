import ejs from 'ejs';

import { upsertStyleTag } from '../lib/utils';
import {
  getRenderData,
  varNamePrimaryColor,
} from './data';

const themes = {}

const themeNames = ['reorx']

// https://vitejs.dev/guide/features.html#disabling-css-injection-into-the-page
// note that `?raw` (https://vitejs.dev/guide/assets.html#importing-asset-as-string)
// cannot be used because we need vite to transform scss into css
const styleMoudules = import.meta.glob("./*/index.scss", { "query": "?inline" })

for (const name of themeNames) {
  const templateModule = await import(`./${name}/index.ejs`)

  // https://vitejs.dev/guide/features.html#glob-import
  const styleModule = await styleMoudules[`./${name}/index.scss`]()

  themes[name] = {
    template: templateModule.default,
    style: styleModule.default,
  }
}

// set default
themes.default = themes.reorx

export function getTheme(name) {
  return themes[name]
}

export function renderTheme(template, cvData, options) {
  return ejs.render(template, getRenderData(cvData), options)
}

const cvStyleId = 'cv-style'

export function renderThemeOn(name, el, data, primaryColor) {
  const theme = getTheme(name)
  el.innerHTML = renderTheme(theme.template, data)

  upsertStyleTag(cvStyleId, theme.style)

  document.documentElement.style.setProperty(varNamePrimaryColor, primaryColor)
}
