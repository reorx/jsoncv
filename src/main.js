import {
  getTemplate,
  render,
} from './renderer';

const template = getTemplate('default')
console.log('template', template)


const elCV = document.querySelector('#cv-container')
elCV.innerHTML = render(template, {})
