import { Cite } from '@citation-js/core'
import '@citation-js/plugin-bibtex'
import '@citation-js/plugin-csl'
import { plugins } from '@citation-js/core'

// Fetch and register IEEE CSL template
fetch('https://raw.githubusercontent.com/citation-style-language/styles/master/ieee.csl')
  .then(response => response.text())
  .then(template => {
    plugins.config.get('@csl').templates.add('ieee', template)
    console.log('[Debug] Successfully registered IEEE CSL template')
  })
  .catch(error => {
    console.error('[Error] Failed to fetch IEEE CSL template:', error)
  })

/**
 * Map BibTeX entry types to CV publication types
 */
const PUBLICATION_TYPE_MAP = {
  // Journal types
  'article': 'journal',
  'article-journal': 'journal',
  'journal-article': 'journal',
  
  // Conference types
  'paper-conference': 'conference',
  'inproceedings': 'conference',
  'conference': 'conference',
  'conference-paper': 'conference',
  'proceedings-article': 'conference',
  
  // Keep other types mapped to 'other' by default
}

// Store the last uploaded BibTeX
let lastBibTeX = null

/**
 * Process BibTeX string and return publications in JSONCV format
 */
export function processBibTeX(bibtexStr, cvData, shouldReplace = false) {
  // Store raw BibTeX
  lastBibTeX = bibtexStr
  
  try {
    // Parse BibTeX
    const cite = new Cite(bibtexStr)
    console.log('[Debug] Total entries in BibTeX:', cite.data.length)
    
    // Format all entries together to get correct numbering
    const formattedHTML = cite.format('bibliography', {
      format: 'html',
      template: 'ieee',
      lang: 'en-US'
    })
    
    // Clean up the HTML structure while preserving content
    const processedHTML = formattedHTML
      .replace(/\r?\n|\r/g, '') // Remove all newlines
      .replace(/>\s+</g, '><')  // Remove whitespace between tags
      .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
      .replace(/, doi: .*?(?=<\/div>)/g, '')  // Remove DOI from citation text
      .trim()                   // Remove leading/trailing whitespace

    // Extract individual citations from the processed HTML
    const citationDivs = processedHTML.match(/<div class="csl-entry">.*?<\/div>/g) || []
    
    // Process each entry with its formatted citation
    const publications = cite.data.map((entry, index) => {
      console.log(`[Debug] Entry ${index} type:`, entry.type)
      
      // Format individual citation
      const singleCite = new Cite(entry)
      const formattedHTML = singleCite.format('bibliography', {
        format: 'html',
        template: 'ieee',
        lang: 'en-US'
      })
      
      // Clean up the HTML structure
      const processedHTML = formattedHTML
        .replace(/\r?\n|\r/g, '') // Remove all newlines
        .replace(/>\s+</g, '><')  // Remove whitespace between tags
        .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
        .replace(/, doi: .*?(?=<\/div>)/g, '')  // Remove DOI from citation text
        .trim()                   // Remove leading/trailing whitespace
      
      const pubType = PUBLICATION_TYPE_MAP[entry.type] || 'other'
      const pub = {
        name: entry.title,
        publisher: entry['container-title'] || entry.journal || '',
        releaseDate: entry.issued?.['date-parts']?.[0]?.[0]?.toString() || entry.year?.toString() || '',
        url: entry.DOI ? `https://doi.org/${entry.DOI}` : entry.URL || '',
        type: pubType,
        formattedHTML: `<div class="citation">${processedHTML}</div>`,
        citationKey: entry.id,
        bibtexEntry: entry,
        source: 'bibtex'
      }
      return pub
    })
    
    // Create a new CV data object with updated publications
    const newCvData = { ...cvData }
    
    if (shouldReplace) {
      // In replace mode, use only BibTeX publications
      newCvData.publications = publications
    } else {
      // In merge mode, combine with existing publications
      newCvData.publications = [...(cvData.publications || []), ...publications]
    }

    // Sort all publications by release date (newest first)
    newCvData.publications.sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
      const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
      return dateB - dateA;
    });

    console.log('[Debug] CV publications after update:', {
      mode: shouldReplace ? 'replace' : 'merge',
      total: newCvData.publications.length,
      fromBibtex: publications.length,
    })
    console.log(newCvData)

    return newCvData
  } catch (error) {
    console.error('[Error] Failed to process BibTeX:', error)
    return cvData
  }
}

/**
 * Get the last uploaded BibTeX data
 */
export function getLastBibTeX() {
  return lastBibTeX
}

/**
 * Parse stringified publication if needed
 */
function _parsePublication(pub) {
  if (typeof pub === 'string') {
    try {
      return JSON.parse(pub)
    } catch (e) {
      console.error('Failed to parse publication:', e)
      return pub
    }
  }
  return pub
}

/**
 * Update publications in CV data (for backward compatibility)
 */
export function updatePublications(cvData, publications, shouldReplace = false) {
  // Just pass through to processBibTeX if we have BibTeX data
  if (lastBibTeX) {
    return processBibTeX(lastBibTeX, cvData, shouldReplace)
  }
  return cvData
} 