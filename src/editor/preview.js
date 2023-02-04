import {
  getCVData,
  getCVSavedTime,
} from '../lib/store';
import { applyThemeTo } from '../themer';

const themeName = 'default'
const elCV = document.querySelector('.cv-container')

applyThemeTo(themeName, elCV, getCVData())

const savedTime = getCVSavedTime()
console.log('preview loaded', Date.now())

const interval = setInterval(() => {
  if (savedTime != getCVSavedTime()) {
    clearInterval(interval)
    location.reload()
  }
}, 1000)
