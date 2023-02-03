import { AbstractIconLib } from '@json-editor/json-editor/src/iconlib.js';

import { getIconSVG } from '../lib/icons';

const iconMapping = {
  collapse: 'mdi:chevron-down',
  expand: 'mdi:chevron-right',
  delete: 'mdi:delete',
  edit: 'mdi:pen',
  add: 'mdi:plus',
  subtract: 'mdi:minus',
  cancel: 'mdi:cancel',
  save: 'mdi:content-save',
  moveup: 'mdi:arrow-up',
  moveright: 'mdi:arrow-right',
  movedown: 'mdi:arrow-down',
  moveleft: 'mdi:arrow-left',
  copy: 'mdi:content-copy',
  clear: 'mdi:close-circle',
  time: 'mdi:clock',
  calendar: 'mdi:calendar',
  edit_properties: 'mdi:format-list-bulleted',
}


export class MyIconLib extends AbstractIconLib {

  getIcon(key) {
    const svg = getIconSVG(iconMapping[key], {dom: true})
    return svg
    // const i = document.createElement('iconify-icon')
    // i.setAttribute('icon', )
    // return i
  }

}

export function registerIconLib(JSONEditor) {
  JSONEditor.defaults.iconlibs['myiconlib'] = MyIconLib
}
