import { reformatDate } from '../lib/date';
import { getIconSVG } from '../lib/icons';
import { renderMarkdown } from '../lib/markdown';

export const varNamePrimaryColor = '--color-primary'

export function getRenderData(cvData, locale, polyglot) {
  return {
    cv: cvData,
    locale,
    t: polyglot.t.bind(polyglot),
    fn: {
      getCVTitle,
      reformatDate,
      getIconSVG,
      noSchemaURL,
      renderMarkdown,
    },
    varNamePrimaryColor,
  }
}

/* fn */

export function getCVTitle(cv) {
  let {name, version} = cv.meta || {}
  if (!name) name = cv.basics.name || 'JSONCV'
  return `${name}${version ? '-' + version : ''}`
}

function noSchemaURL(url) {
  url = url.replace(/https?:\/\//, '')
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  return url
}
