export const createElement = function(tagName, {className, text, attrs, parent}) {
  const el = document.createElement(tagName)
  if (className)
    el.className = className
  if (text)
    el.textContent = text
  if (attrs) {
    for (const key in attrs) {
      el.setAttribute(key, attrs[key])
    }
  }
  if (parent) {
    parent.appendChild(el)
  }
  return el
}

export const traverseDownObject = function(obj, callback) {
  for (const key in obj) {
    const value = obj[key]
    if (typeof value === 'object') {
      callback(key, value)
      traverseDownObject(value, callback)
    }
  }
}

export const propertiesToObject = function(properties) {
  const o = {}
  for (const [k, def] of Object.entries(properties)) {
    let v
    switch (def.type) {
      case 'string':
        v = ''
        break
      case 'number':
        v = 0
        break
      case 'array':
        v = []
        break
      case 'object':
        v = propertiesToObject(def.properties)
        break
    }
    if (v === undefined) continue
    o[k] = v
  }
  return o
}

export function downloadContent(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function downloadIframeHTML(filename, iframe) {
  const blob = new Blob([iframe.contentDocument.documentElement.outerHTML], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.style.display = 'none';
  a.click();
  document.body.removeChild(a)
}

export function upsertStyleTag(styleId, content) {
  let elStyle = document.getElementById(styleId)
  if (!elStyle) {
    elStyle = document.createElement('style')
    elStyle.id = styleId
    document.head.appendChild(elStyle)
  }
  elStyle.innerHTML = content
}
