import { reformatDate } from '../lib/date';
import { getIconSVG } from '../lib/icons';

export function getRenderData(cvData) {
  return {
    cv: cvData,
    fn: {
      getCVTitle,
      reformatDate,
      getIconSVG,
      noSchemaURL,
    }
  }
}

/* fn */

export function getCVTitle(cv) {
  let {name, version} = cv.meta
  if (!name) name = cv.basics.name || 'JSONCV'
  return `${name}${version ? ' ' + version : ''}`
}

function noSchemaURL(url) {
  url = url.replace(/https?:\/\//, '')
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  return url
}
