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
