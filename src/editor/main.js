import 'iconify-icon'; // import only

import $ from 'cash-dom';
import objectPath from 'object-path';

import { JSONEditor } from '@json-editor/json-editor/dist/jsoneditor';

import * as exampleData from '../../sample.resume.json';
import { saveCVJSON } from '../lib/store';
import {
  createElement,
  traverseDownObject,
} from '../lib/utils';
import * as jsoncvSchemaModule from '../schema/jsoncv.schema.json';
import { registerIconLib } from './iconlib';
import { registerTheme } from './theme';

const propertiesInOrder = ['basics', 'education', 'work', 'skills', 'projects', 'languages', 'interests', 'references', 'awards', 'publications', 'volunteer']
const basicsPropertiesInOrder = ['name', 'label', 'email', 'phone', 'url', 'summary', 'image', 'location', 'profiles']

// toc elements
const elToc = document.querySelector('.editor-toc')
const tocUl = createElement('ul', {
  parent: elToc
})
const basicsUl = createElement('ul', {
  parent: tocUl
})


// copy the object to remove the readonly restriction on module
const jsoncvSchema = {...jsoncvSchemaModule.default}

// add propertyOrder to schema, and add links to toc
propertiesInOrder.forEach((name, index) => {
  jsoncvSchema.properties[name].propertyOrder = index

  const li = createElement('li', {parent: tocUl})
  createElement('a', {
    text: name,
    attrs: {
      href: `#root.${name}`
    },
    parent: li,
  })

  if (name === 'basics') {
    li.appendChild(basicsUl)
  }
})
basicsPropertiesInOrder.forEach((name, index) => {
  jsoncvSchema.properties.basics.properties[name].propertyOrder = index
  const li = createElement('li', {parent: basicsUl})
  createElement('a', {
    text: name,
    attrs: {
      href: `#root.basics.${name}`
    },
    parent: li,
  })
})

// add headerTemplate for each type:array in schema
traverseDownObject(jsoncvSchema, (key, obj) => {
  let noun = key
  if (noun.endsWith('s')) noun = noun.slice(0, -1)
  if (obj.type === 'array' && obj.items) {
    obj.items.headerTemplate = `${noun} {{i1}}`
  }
})

// add format to schema
const keyFormatMap = {
  'basics.properties.summary': 'textarea',
}
for (const [key, format] of Object.entries(keyFormatMap)) {
  objectPath.get(jsoncvSchema.properties, key).format = format
}

// change schema title
jsoncvSchema.title = 'Resume'

// initialize editor
registerTheme(JSONEditor)
registerIconLib(JSONEditor)
const elEditorContainer = document.querySelector('.editor-container')
const editor = new JSONEditor(elEditorContainer, {
  schema: jsoncvSchema,
  theme: 'mytheme',
  iconlib: 'myiconlib',
  disable_array_delete_all_rows: true,
  no_additional_properties: true,
  startval: exampleData,
});
editor.on('ready',() => {
  // editor.setValue(exampleData)

  // add anchor to each schema element
  document.querySelectorAll('[data-schemapath]').forEach(el => {
    const schemapath = el.getAttribute('data-schemapath')
    el.id = schemapath
  })
})

const $outputJSON = $('.output-json')
const $outputHTML = $('.output-html')

// listen to change
editor.on('change', () => {
  console.log('on editor change')
  const cvJSON = JSON.stringify(editor.getValue(), null, 2)
  $outputJSON.text(cvJSON)

  // save to localstorage
  saveCVJSON(cvJSON)
})

// actions
const $btnShowPreview = $('#fn-show-preview')
const $btnShowJSON = $('#fn-show-json')

$btnShowPreview.on('click', () => {
  $outputJSON.hide()
  $outputHTML.show()
})

$btnShowJSON.on('click', () => {
  $outputHTML.hide()
  $outputJSON.show()
})
