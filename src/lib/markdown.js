/* Until "2023020922 vite ERR_IMPORT_ASSERTION_TYPE_MISSING" is resolved, micromark cannot be used
import { micromark } from 'micromark';
import {
  gfm,
  gfmHtml,
} from 'micromark-extension-gfm';

export function renderMarkdown(text) {
  return micromark(text, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()]
  })
}
*/

import MarkdownIt from 'markdown-it';

const md = new MarkdownIt()

export function renderMarkdown(text, inline = false) {
  if (inline) {
    return md.renderInline(text)
  }
  return md.render(text)
}
