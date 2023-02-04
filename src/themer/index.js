import ejs from 'ejs';

const themes = {}

const themeNames = ['reorx']

// https://vitejs.dev/guide/features.html#disabling-css-injection-into-the-page
// note that `?raw` (https://vitejs.dev/guide/assets.html#importing-asset-as-string)
// cannot be used because we need vite to transform scss into css
const styleMoudules = import.meta.glob("../templates/*/index.scss", { "query": "?inline" })

for (const name of themeNames) {
  const templateModule = await import(`../templates/${name}/index.ejs`)

  // https://vitejs.dev/guide/features.html#glob-import
  const styleModule = await styleMoudules[`../templates/${name}/index.scss`]()

  themes[name] = {
    template: templateModule.default,
    style: styleModule.default,
  }
}

// set default
themes.default = themes.reorx

export function getTheme(name) {
  return themes[name]
}

export function render(template, data, options) {
  return ejs.render(template, data, options)
}

const cvStyleId = 'cv-style'

export function applyThemeTo(name, data, el) {
  const theme = getTheme(name)
  el.innerHTML = render(theme.template, data)

  let elStyle = document.getElementById(cvStyleId)
  if (!elStyle) {
    elStyle = document.createElement('style')
    document.head.appendChild(elStyle)
  }
  elStyle.innerHTML = theme.style
}
