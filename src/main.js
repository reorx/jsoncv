import * as exampleData from '../data/rxresume-converted.json';
import { applyThemeTo } from './themer';

const elCV = document.querySelector('.cv-container')


applyThemeTo('default', elCV, exampleData)
