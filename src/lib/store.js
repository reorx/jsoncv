const storeKeyCV = 'cv-data'
const storeKeyCVSavedTime = 'cv-data-saved-time'
const storeKeyPrimaryColor = 'primary-color'
const storeKeyPageSize = 'page-size'
const storeKeyTheme = 'theme'

export function saveCVJSON(json) {
  localStorage.setItem(storeKeyCV, json)
  localStorage.setItem(storeKeyCVSavedTime, Date.now().toString())
}

export function getCVData() {
  const json = localStorage.getItem(storeKeyCV)
  if (!json) return null
  return JSON.parse(json)
}

export function getCVSavedTime() {
  return localStorage.getItem(storeKeyCVSavedTime)
}

export function savePrimaryColor(color) {
  localStorage.setItem(storeKeyPrimaryColor, color)
}

export function getPrimaryColor() {
  return localStorage.getItem(storeKeyPrimaryColor) || '#aaaaaa'
}

export function savePageSize(size) {
  localStorage.setItem(storeKeyPageSize, size)
}

export function getPageSize() {
  return localStorage.getItem(storeKeyPageSize) || 'A4'
}

export function saveTheme(theme) {
  localStorage.setItem(storeKeyTheme, theme)
}

export function getTheme() {
  return localStorage.getItem(storeKeyTheme) || 'reorx'
}
