// Core dependencies first
import { JSONEditor } from '@json-editor/json-editor/dist/jsoneditor';
import $ from 'cash-dom';
import dayjs from 'dayjs';
import objectPath from 'object-path';

// Local imports
import * as sampleModule from '../../sample/sample.cv.prof.json';
import * as jsoncvSchemaModule from '../../schema/jsoncv.schema.json';
import { processBibTeX, updatePublications, getLastBibTeX } from '../lib/bibtex';
import {
  getCVData,
  getPrimaryColor,
  saveCVJSON,
  savePrimaryColor,
  savePageSize,
  getTheme,
  saveTheme,
} from '../lib/store';
import {
  createElement,
  downloadContent,
  downloadIframeHTML,
  propertiesToObject,
  traverseDownObject,
} from '../lib/utils';
import { getCVTitle } from '../themes/data';
import { getAvailableThemes, getThemeDefaultColor } from '../themes';
import { registerIconLib } from './je-iconlib';
import { registerTheme } from './je-theme';

// Load iconify last as it's optional for UI
import 'iconify-icon';

// toc elements
const elToc = document.querySelector('.editor-toc')
const tocUl = createElement('ul', { parent: elToc })
const basicsUl = createElement('ul', { parent: tocUl })

// init data
let data = getCVData()
if (!data) data = sampleModule.default

// Initialize editor with schema and data
async function initializeEditor() {
  // Get schema (remote or local)
  let schema
  if (data.$schema) {
    try {
      const response = await fetch(data.$schema)
      schema = await response.json()
    } catch (error) {
      console.error('Error fetching schema:', error)
      schema = {...jsoncvSchemaModule.default}
    }
  } else {
    schema = {...jsoncvSchemaModule.default}
  }

  // Validate schema structure
  if (!schema || !schema.properties) {
    schema = {...jsoncvSchemaModule.default}
  }

  // Add property order and build TOC
  const excludeFromTOC = ['$schema', 'sideProjects', 'languages', 'interests']
  
  Object.keys(schema.properties).forEach((name, index) => {
    // Add order
    schema.properties[name].propertyOrder = index
    
    // Skip excluded sections in TOC
    if (excludeFromTOC.includes(name)) {
      return
    }
    
    // Create TOC entry
    const li = createElement('li', { parent: tocUl })
    createElement('a', {
      text: name,
      attrs: { href: `#root.${name}` },
      parent: li,
    })

    // Special handling for basics section
    if (name === 'basics' && schema.properties[name].properties) {
      // only add location and profiles to basics toc
      ['location', 'profiles'].forEach(subName => {
        if (schema.properties[name].properties[subName]) {
          const subLi = createElement('li', { parent: basicsUl })
          createElement('a', {
            text: subName,
            attrs: { href: `#root.basics.${subName}` },
            parent: subLi,
          })
        }
      })
      li.appendChild(basicsUl)
    }
  })

  // Add headerTemplate for arrays
  traverseDownObject(schema, (key, obj) => {
    let noun = key
    if (noun.endsWith('s')) noun = noun.slice(0, -1)
    if (obj.type === 'array' && obj.items) {
      obj.items.headerTemplate = `${noun} {{i1}}`
    }
  })

  // Add format to schema
  const keyFormatMap = {
    // Basic fields
    'basics.properties.summary': 'textarea',

    // Work and projects
    'work.items.properties': {
      'description': 'textarea',
      'summary': 'textarea',
      'highlights.items': 'textarea'
    },
    'projects.items.properties': {
      'description': 'textarea',
      'highlights.items': 'textarea'
    },
    'sideProjects.items.properties.description': 'textarea',

    // Skills and qualifications
    'skills.items.properties.summary': 'textarea',
    'languages.items.properties.summary': 'textarea',
    'references.items.properties.reference': 'textarea',

    // Awards and recognition
    'awards.items.properties.summary': 'textarea',
    'publications.items.properties.summary': 'textarea',
    'volunteer.items.properties': {
      'summary': 'textarea',
      'highlights.items': 'textarea'
    },

    // Academic fields
    'researchAreas.items.properties': {
      'description': 'textarea',
      'contributions.items': 'textarea'
    },
    'academicAppointments.items.properties.summary': 'textarea',
    'teaching.items.properties.description': 'textarea',
    'grants.items.properties.summary': 'textarea',
    'mentoring.items.properties.summary': 'textarea',
    'professionalServices.items.properties.details': 'textarea',
    'presentations.items.properties.description': 'textarea',
    'software.items.properties.description': 'textarea'
  }

  // Process nested format mappings
  for (const [key, value] of Object.entries(keyFormatMap)) {
    if (typeof value === 'string') {
      // Direct format mapping
      const property = objectPath.get(schema.properties, key)
      if (property) {
        property.format = value
      }
    } else {
      // Nested format mappings
      for (const [subKey, format] of Object.entries(value)) {
        const fullKey = `${key}.${subKey}`
        const property = objectPath.get(schema.properties, fullKey)
        if (property) {
          property.format = format
        }
      }
    }
  }

  // Set schema title and update descriptions
  schema.title = 'CV Schema'
  if (schema.properties.meta?.properties?.lastModified) {
    schema.properties.meta.properties.lastModified.description += '. This will be automatically updated when downloading.'
  }

  // Initialize editor
  registerTheme(JSONEditor)
  registerIconLib(JSONEditor)
  const elEditorContainer = document.querySelector('.editor-container')
  const editor = new JSONEditor(elEditorContainer, {
    schema: schema,
    theme: 'mytheme',
    iconlib: 'myiconlib',
    disable_array_delete_all_rows: true,
    no_additional_properties: true,
    startval: data,
  });

  return editor;
}

// Initialize the editor
let editor;
initializeEditor().then(e => {
  editor = e;
  // Add ready handler
  editor.on('ready',() => {
    // add anchor to each schema element
    document.querySelectorAll('[data-schemapath]').forEach(el => {
      const schemapath = el.getAttribute('data-schemapath')
      el.id = schemapath
    })

    // Initialize color picker from meta or localStorage
    const initialData = editor.getValue()
    const primaryColor = initialData.meta?.colorPrimary || getPrimaryColor()
    $colorValue.text(primaryColor)
    $inputColorPicker.val(primaryColor)

    // Set initial theme from meta or storage
    const initialTheme = initialData.meta?.theme || getTheme()
    $themePicker.val(initialTheme)
    saveTheme(initialTheme)  // Ensure storage is synced
  });

  // Add change handler
  editor.on('change', () => {
    const data = editor.getValue()
    const json = JSON.stringify(data, null, 2)
    $outputJSON.text(json)

    // save to localstorage
    saveCVJSON(json)
    
    // sync page size with localStorage
    const pageSize = data.meta?.pageSize || 'A4'
    savePageSize(pageSize)
  });
});

function getEditorData() {
  return editor.getValue()
}

const $outputJSON = $('.output-json')
const $outputHTML = $('.output-html')
const outputHTMLIframe = $outputHTML.get(0)

// actions
const $btnTogglePreview = $('#fn-toggle-preview')
const $btnNewData = $('#fn-new-data')
const $btnUploadData = $('#fn-upload-data')
const $inputUploadData = $('input[name=upload-data]')
const $btnDownloadJSON = $('#fn-download-json')
const $btnDownloadHTML = $('#fn-download-html')
const $btnLoadSample = $('#fn-load-sample')
const $btnPrintPreview = $('#fn-print-preview')
const $inputColorPicker = $('#fn-color-picker')
const $colorValue = $('.color-picker .value')

const isElementHidden = elt =>
	! (elt.offsetWidth || elt.offsetHeight || elt.getClientRects().length);
$btnTogglePreview.on('click', () => {
  if (isElementHidden(outputHTMLIframe)) {
    $outputJSON.hide()
    $outputHTML.show()
  } else {
    $outputHTML.hide()
    $outputJSON.show()
  }
})

$btnNewData.on('click', () => {
  if (!confirm('Are you sure to create an empty CV? Your current data will be lost.')) return

  const v = propertiesToObject(jsoncvSchema.properties)
  console.log('new value', v)
  editor.setValue(v)
})

$btnUploadData.on('click', () => {
  if (!confirm('Are you sure to upload an existing CV data? Your current data will be replaced.')) return
  $inputUploadData.trigger('click')
})

$inputUploadData.on('change', () => {
  const files = $inputUploadData.get(0).files
  if (files.length === 0) return

  const reader = new FileReader()
  reader.onload = (e) => {
    let data
    try {
      data = JSON.parse(e.target.result)
    } catch (e) {
      const error = 'Invalid JSON file: ' + new String(e).toString()
      console.log(error)
      throw e
    }
    editor.setValue(data)
  }

  reader.readAsText(files[0])
})

function downloadCV(contentType) {
  const data = editor.getValue()
  const meta = data.meta || (data.meta = {})
  const title = getCVTitle(data)

  // update data
  meta.lastModified = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]')

  // download
  if (contentType === 'json') {
    let filename = `${title}.json`
    downloadContent(filename, JSON.stringify(data, null, 2))
  } else if (contentType === 'html') {
    let filename = `${title}.html`
    downloadIframeHTML(filename, outputHTMLIframe)
  }

  // update editor value
  editor.getEditor('root.meta').setValue(meta)
}

$btnDownloadJSON.on('click', () => {
  downloadCV('json')
})

$btnDownloadHTML.on('click', () => {
  downloadCV('html')
})

$btnLoadSample.on('click', () => {
  if (!confirm('Are you sure to load sample data? Your current data will be replaced.')) return

  editor.setValue(sampleModule.default)
})

$btnPrintPreview.on('click', () => {
  outputHTMLIframe.contentWindow.print()
})


// primary color

$inputColorPicker.on('change', (e) => {
  const color = e.target.value
  console.log('color changed to:', color)
  
  // Update both meta and localStorage
  const editorData = editor.getValue()
  if (!editorData.meta) editorData.meta = {}
  editorData.meta.colorPrimary = color
  editor.setValue(editorData)
  savePrimaryColor(color)
  $colorValue.text(color)
})

// Initialize theme picker
const $themePicker = $('#fn-theme-picker')
const themes = getAvailableThemes()
themes.forEach(theme => {
  const option = createElement('option', {
    text: theme,
    attrs: { value: theme }
  })
  $themePicker.append(option)
})

// Theme colors
const themeColors = {
  reorx: '#aaaaaa',
  cuiv: '#cc0000'
}

// Handle theme changes
$themePicker.on('change', (e) => {
  const selectedTheme = e.target.value
  console.log('theme changed to:', selectedTheme)
  
  // Update both theme and color in one operation
  const editorData = editor.getValue()
  if (!editorData.meta) editorData.meta = {}
  editorData.meta.theme = selectedTheme
  editorData.meta.colorPrimary = getThemeDefaultColor(selectedTheme)
  
  // Update editor and storage
  editor.setValue(editorData)  // triggers preview refresh
  saveTheme(selectedTheme)
  savePrimaryColor(editorData.meta.colorPrimary)
  
  // Update color picker UI
  $colorValue.text(editorData.meta.colorPrimary)
  $inputColorPicker.val(editorData.meta.colorPrimary)
})

// BibTeX handling
const $btnUploadBibTeX = $('#fn-upload-bibtex')
const $btnDownloadBibTeX = $('#fn-download-bibtex')
const $inputUploadBibTeX = $('input[name=upload-bibtex]')

$btnUploadBibTeX.on('click', () => {
  $inputUploadBibTeX.trigger('click')
})

$inputUploadBibTeX.on('change', async () => {
  const files = $inputUploadBibTeX.get(0).files
  if (files.length === 0) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const bibtexStr = e.target.result
      const currentData = editor.getValue()
      const publications = await processBibTeX(bibtexStr, currentData)
      
      // Get current mode from radio buttons
      const shouldReplace = $('input[name="bibtex-mode"]:checked').val() === 'replace'
      const newData = updatePublications(currentData, publications, shouldReplace)
      editor.setValue(newData)
    } catch (e) {
      console.error('Error processing BibTeX:', e)
      alert('Error processing BibTeX file. Please check the console for details.')
    }
  }

  reader.readAsText(files[0])
})

$btnDownloadBibTeX.on('click', () => {
  const bibtexStr = getLastBibTeX()
  if (!bibtexStr) {
    alert('No BibTeX data available. Please upload a BibTeX file first.')
    return
  }
  downloadContent('references.bib', bibtexStr)
})
