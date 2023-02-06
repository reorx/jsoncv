import { reformatDate } from '../lib/date';
import { getIconSVG } from '../lib/icons';

export function getRenderData(cvData) {
  return {
    cv: cvData,
    fn: {
      reformatDate,
      getIconSVG,
      noSchemaURL,
    }
  }
}

/* fn */

function noSchemaURL(url) {
  url = url.replace(/https?:\/\//, '')
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }
  return url
}
