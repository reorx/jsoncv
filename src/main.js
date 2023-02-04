import * as exampleData from '../data/rxresume-converted.json';
import { reformatDate } from './lib/date';
import { applyThemeTo } from './themer';

const elCV = document.querySelector('.cv-container')


applyThemeTo('default', {
  cv: exampleData,
  fn: {
    reformatDate,
  }
}, elCV)
