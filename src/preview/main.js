import {
  getCVData,
  getCVSavedTime,
  getPrimaryColor,
} from '../lib/store';
import { upsertStyleTag } from '../lib/utils';
import cvBaseStyle from '../scss/cv-base.css?inline';
import { renderThemeOn } from '../themes';
import { getCVTitle } from '../themes/data';

const themeName = 'default'
const elCV = document.querySelector('.cv-container')

// Save scroll position on page unload
const storeKeyScroll = 'scroll-position'
const onScroll = () => {
  localStorage.setItem(storeKeyScroll, JSON.stringify({
    scrollX: window.scrollX,
    scrollY: window.scrollY,
  }));
}
let onScrollTimer
window.addEventListener("scroll", () => {
  if (onScrollTimer) clearTimeout(onScrollTimer)

  onScrollTimer = setTimeout(onScroll, 50);
}, false)

const restoreScrollPosition = () => {
  const scrollPosition = JSON.parse(localStorage.getItem(storeKeyScroll));
  if (scrollPosition) {
    window.scrollTo(scrollPosition.scrollX, scrollPosition.scrollY);
  }
}

// Render CV
const data = getCVData()
if (data) {

  upsertStyleTag('base-style', cvBaseStyle)
  renderThemeOn(themeName, elCV, data, getPrimaryColor())

  // change document title
  document.title = getCVTitle(data)
  // restore scroll position
  restoreScrollPosition()
}

const savedTime = getCVSavedTime()
console.log('preview loaded', Date.now())

const interval = setInterval(() => {
  if (savedTime != getCVSavedTime()) {
    clearInterval(interval)
    location.reload()
  }
}, 1000)
