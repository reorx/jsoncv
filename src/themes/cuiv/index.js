import ejs from 'ejs';
import { upsertStyleTag } from '../../lib/utils';
import { getRenderData, varNamePrimaryColor } from '../data';
import template from './index.ejs';
import style from './index.scss?inline';

export const defaultColor = '#cc0000'  // matches :root { --color-primary } in index.scss

// Get system color scheme
function getSystemColorMode() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log('System color mode:', isDark ? 'dark' : 'light');
  return isDark ? 'dark' : 'light';
}

// Make toggleTheme available globally
window.toggleTheme = function() {
  const cvContainer = document.querySelector('.cv-container');
  const themeToggle = document.querySelector('.theme-toggle');
  if (!cvContainer || !themeToggle) {
    console.log('Toggle failed: Elements not found', { cvContainer, themeToggle });
    return;
  }
  
  const currentMode = cvContainer.getAttribute('data-color-mode') || getSystemColorMode();
  console.log('Current color mode before toggle:', currentMode);
  console.log('Current attributes:', {
    container: cvContainer.getAttribute('data-color-mode'),
    toggle: themeToggle.getAttribute('data-mode')
  });
  
  const newMode = currentMode === 'light' ? 'dark' : 'light';
  console.log('New color mode:', newMode);
  
  cvContainer.setAttribute('data-color-mode', newMode);
  themeToggle.setAttribute('data-mode', newMode);
  localStorage.setItem('colorMode', newMode);
  
  console.log('After toggle attributes:', {
    container: cvContainer.getAttribute('data-color-mode'),
    toggle: themeToggle.getAttribute('data-mode'),
    stored: localStorage.getItem('colorMode')
  });
}

export function renderTheme(el, data, primaryColor) {
  console.log('Rendering theme...');
  el.innerHTML = ejs.render(template, getRenderData(data));
  upsertStyleTag('cv-style', style);
  document.documentElement.style.setProperty(varNamePrimaryColor, primaryColor);
  
  // Initialize color mode based on stored preference or system preference
  const storedMode = localStorage.getItem('colorMode');
  console.log('Stored color mode:', storedMode);
  const initialMode = storedMode || getSystemColorMode();
  console.log('Initial color mode:', initialMode);
  
  const cvContainer = document.querySelector('.cv-container');
  const themeToggle = document.querySelector('.theme-toggle');
  if (cvContainer && themeToggle) {
    console.log('Setting initial color mode...');
    cvContainer.setAttribute('data-color-mode', initialMode);
    themeToggle.setAttribute('data-mode', initialMode);
    console.log('Initial attributes set:', {
      container: cvContainer.getAttribute('data-color-mode'),
      toggle: themeToggle.getAttribute('data-mode')
    });
  } else {
    console.log('Elements not found during initialization:', { cvContainer, themeToggle });
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('colorMode')) {
      const newMode = e.matches ? 'dark' : 'light';
      console.log('System color mode changed:', newMode);
      cvContainer.setAttribute('data-color-mode', newMode);
      themeToggle.setAttribute('data-mode', newMode);
    }
  });
} 