import { JSONEditor } from '@json-editor/json-editor/dist/jsoneditor';

import * as exampleData from '../sample.resume.json';
import * as jsoncvSchema from '../schema/jsoncv.schema.json';
import { createElement } from './utils';

const propertiesInOrder = ['basics', 'education', 'work', 'skills', 'projects', 'languages', 'interests', 'references', 'awards', 'publications', 'volunteer']
const basicsPropertiesInOrder = ['name', 'label', 'email', 'phone', 'url', 'summary', 'image', 'location', 'profiles']

// toc elements
const elToc = document.querySelector('#editor-toc')
const tocUl = createElement('ul', {
  parent: elToc
})
const basicsUl = createElement('ul', {
  parent: tocUl
})

const attrSchemaPathTo = 'data-schemapath-to'

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

// initialize editor
const elEditorContainer = document.querySelector('#editor-container')
const editor = new JSONEditor(elEditorContainer, {
  schema: jsoncvSchema,
});
editor.on('ready',() => {
  editor.setValue(exampleData)

  // add anchor to each schema element
  document.querySelectorAll('[data-schemapath]').forEach(el => {
    const schemapath = el.getAttribute('data-schemapath')
    el.id = schemapath
    console.log('el', schemapath)
  })
})
