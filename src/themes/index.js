import dayjs from 'dayjs';
import ejs from 'ejs';
import Polyglot from 'node-polyglot';

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

console.log('themes index')
for (const name of themeNames) {
  const templateModule = await import(`./${name}/index.ejs`)
  const themeModule = await import(`./${name}/index.js`)
  console.log(`theme supported locales: ${themeModule.locales}`)

  // https://vitejs.dev/guide/features.html#glob-import
  const styleModule = await styleMoudules[`./${name}/index.scss`]()

  themes[name] = {
    index: themeModule,
    template: templateModule.default,
    style: styleModule.default,
  }
}

// set default
themes.default = themes.reorx

export function getTheme(name) {
  return themes[name]
}

export function renderTheme(theme, cvData, options) {
  const locale = cvData.meta.locale || 'en'
  const messages = theme.index.localeMessages[locale]
  if (!messages) {
    return `Error: locale '${locale}' is not supported, please use one of: ${theme.index.locales}`
  }
  const polyglot = new Polyglot({
    phrases: messages,
    locale,
  })
  dayjs.locale(locale)
  return ejs.render(theme.template, getRenderData(cvData, locale, polyglot), options)
}

const cvStyleId = 'cv-style'

export function renderThemeOn(name, el, data, primaryColor) {
  const theme = getTheme(name)
  el.innerHTML = renderTheme(theme, data)

  upsertStyleTag(cvStyleId, theme.style)

  document.documentElement.style.setProperty(varNamePrimaryColor, primaryColor)
}

export function loadThemeData(name) {
  require(`./${name}/index.js`)
}
