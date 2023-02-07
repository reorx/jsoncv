import '../scss/print.css';

import {
  getCVData,
  getCVSavedTime,
} from '../lib/store';
import { applyThemeTo } from '../themes';
import { getCVTitle } from '../themes/data';

const themeName = 'default'
const elCV = document.querySelector('.cv-container')

const data = getCVData()
if (data) {
  applyThemeTo(themeName, elCV, data)
  // change document title
  document.title = getCVTitle(data)
}

const savedTime = getCVSavedTime()
console.log('preview loaded', Date.now())

const interval = setInterval(() => {
  if (savedTime != getCVSavedTime()) {
    clearInterval(interval)
    location.reload()
  }
}, 1000)
