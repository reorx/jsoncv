import ejs from 'ejs';
import { upsertStyleTag } from '../../lib/utils';
import { getRenderData, varNamePrimaryColor } from '../data';
import template from './index.ejs';
import style from './index.scss?inline';

export const defaultColor = '#aaaaaa'  // matches :root { --color-primary } in index.scss

export function renderTheme(el, data, primaryColor) {
  el.innerHTML = ejs.render(template, getRenderData(data))
  upsertStyleTag('cv-style', style)
  document.documentElement.style.setProperty(varNamePrimaryColor, primaryColor)
} 