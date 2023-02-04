import ejs from 'ejs';

const templateModules  = {
  reorx: await import('../templates/reorx.ejs'),
}

templateModules['default'] = templateModules['reorx']

export function getTemplate(name) {
  return templateModules[name].default
}

export function render(template, data, options) {
  return ejs.render(template, data, options)
}
