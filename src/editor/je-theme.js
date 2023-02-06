import { AbstractTheme } from '@json-editor/json-editor/src/theme.js';

export class MyTheme extends AbstractTheme {
  getFormInputLabel (text, req) {
    const el = super.getFormInputLabel(text, req)
    el.classList.add('je-form-input-label')
    return el
  }

  getFormInputDescription (text) {
    const el = super.getFormInputDescription(text)
    el.classList.add('je-form-input-description')
    return el
  }

  getIndentedPanel () {
    const el = super.getIndentedPanel()
    el.classList.add('je-indented-panel')
    return el
  }

  getTopIndentedPanel () {
    return this.getIndentedPanel()
  }

  getChildEditorHolder () {
    const el = super.getChildEditorHolder()
    el.classList.add('je-child-editor-holder')
    return el
  }

  getHeaderButtonHolder () {
    const el = this.getButtonHolder()
    el.classList.add('je-header-button-holder')
    return el
  }

  getTable () {
    const el = super.getTable()
    el.classList.add('je-table')
    return el
  }

  addInputError (input, text) {
    const group = this.closest(input, '.form-control') || input.controlgroup

    if (!input.errmsg) {
      input.errmsg = document.createElement('div')
      input.errmsg.setAttribute('class', 'errmsg')
      input.errmsg.style = input.errmsg.style || {}
      input.errmsg.style.color = 'red'
      group.appendChild(input.errmsg)
    } else {
      input.errmsg.style.display = 'block'
    }

    input.errmsg.innerHTML = ''
    input.errmsg.appendChild(document.createTextNode(text))
  }

  removeInputError (input) {
    if (input.style) {
      input.style.borderColor = ''
    }
    if (input.errmsg) input.errmsg.style.display = 'none'
  }
}

export function registerTheme(JSONEditor) {
  JSONEditor.defaults.themes['mytheme'] = MyTheme
}
