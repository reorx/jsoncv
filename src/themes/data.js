import { reformatDate } from '../lib/date';
import { getIconSVG } from '../lib/icons';

export function getRenderData(cvData) {
  return {
    cv: cvData,
    fn: {
      reformatDate,
      getIconSVG,
      urlNoSchema,
    }
  }
}

/* fn */

function urlNoSchema(url) {
  return url.replace(/https?:\/\//, '')
}
