import ejs from 'ejs';

import { upsertStyleTag } from '../lib/utils';
import {
  getRenderData,
  varNamePrimaryColor,
} from './data';

import { renderTheme as renderReorxTheme, defaultColor as reorxColor } from './reorx/index.js'
import { renderTheme as renderCuivTheme, defaultColor as cuivColor } from './cuiv/index.js'

const themes = {
  reorx: renderReorxTheme,
  cuiv: renderCuivTheme,
}

const themeColors = {
  reorx: reorxColor,
  cuiv: cuivColor,
}

export function getAvailableThemes() {
  return Object.keys(themes)
}

export function getThemeDefaultColor(themeName) {
  return themeColors[themeName]
}

export function renderThemeOn(themeName, el, data, primaryColor) {
  const renderFn = themes[themeName]
  if (!renderFn) {
    console.error(`Theme ${themeName} not found`)
    return
  }
  renderFn(el, data, primaryColor)
}
