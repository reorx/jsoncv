export const storeKeys = {
  cvJSON: 'cvJSON',
  cvSavedTime: 'cvSavedTime',
}

export function saveCVJSON(str) {
  localStorage.setItem(storeKeys.cvJSON, str)
  localStorage.setItem(storeKeys.cvSavedTime, Date.now())
}

export function getCVData() {
  const v = localStorage.getItem(storeKeys.cvJSON)
  if (!v) return
  return JSON.parse(v)
}

export function getCVSavedTime() {
  return localStorage.getItem(storeKeys.cvSavedTime)
}
