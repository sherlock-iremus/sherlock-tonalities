const makeSvgRect = (x, y, w, h, fill) => {
  const svgns = 'http://www.w3.org/2000/svg'
  const e = document.createElementNS(svgns, 'rect')
  e.setAttributeNS(null, 'x', x)
  e.setAttributeNS(null, 'y', y)
  e.setAttributeNS(null, 'width', w)
  e.setAttributeNS(null, 'height', h)
  e.setAttributeNS(null, 'fill', fill)
  return e
}

export const drawVerticalities = e => {
  let node = e.target
  let measure = null
  let note = null
  while (node) {
    if (node.classList) {
      if (node.classList.contains('measure')) {
        measure = node
        break
      } else if (node.classList.contains('note') && node.classList.contains('hovered')) {
        note = node
      }
    }
    node = node.parentNode
  }
  if (note && measure) {
    console.log(note.getBBox(), measure.getBBox())
    measure.appendChild(makeSvgRect(0, 0, 200, 200, 'blue'))
  }
}

// WIP
export const drawMeasureAnchor = measure => {
  const measureCoordinates = measure.getBoundingClientRect()
  console.log(measureCoordinates.x, measureCoordinates.y)
  const icon = makeSvgRect(measureCoordinates.x, measureCoordinates.y, 200, 200, 'blue')
  icon.innerHTML = "<path stroke-linecap=&#34;round&#34; stroke-linejoin=&#34;round&#34; stroke-width=&#34;2&#34; d=&#34;M19 9l-7 7-7-7&#34; />"
  icon.setAttributeNS(null, "id", "measure");
  measure.appendChild(icon)
}

export const getPathNodes = measure => {
  const measureChildNodes = Array.from(measure.childNodes)
  const staffNodes = measureChildNodes.filter(child => child.classList && child.classList.contains('staff'))
  const staffChildNodes = staffNodes.map(staff => Array.from(staff.childNodes)).flat()
  return staffChildNodes.filter(child => child.tagName === 'path')
}

export const getNodeNote = e => {
  let mouseNode = null
  let noteNode = null

  switch (e.target.tagName) {
    case 'tspan':
    case 'use':
      let parentNode = e.target.parentNode
      while (
        parentNode.classList &&
        !parentNode.classList.contains('note') &&
        !parentNode.classList.contains('label')
      ) {
        parentNode = parentNode.parentNode
      }
      if (parentNode.classList && parentNode.classList.contains('note')) {
        mouseNode = e.target
        noteNode = parentNode
      }
      break
    default:
      break
  }

  if (mouseNode && noteNode) {
    return { mouseNode, noteNode }
  } else return null
}

export const getMeasures = e => {
  if (e.tagName === 'g' || e.tagName === 'svg') {
    if (e.classList && e.classList.contains('measure')) return e
    if (e.hasChildNodes()) {
      const classList = ['measure', 'system', 'page-margin', 'definition-scale']
      const childNodes = Array.from(e.childNodes)
      const children = childNodes.filter(child => child.classList && classList.some(c => child.classList.contains(c)))
      return !children.length ? null
        : children.length === 1 ? getMeasures(children[0])
        : children.map(child => getMeasures(child))
    }
  }
  return null
}

export const getNodeMeasure = e => {
  let measures = getMeasures(e.target)
  if (measures) {
    // temporairement, on ne va garder que la première portée
    if (Array.isArray(measures[0])) measures = measures[0]
    const measureCoordinates = measures.map(measure => measure.getBoundingClientRect())
    const selectedMeasureIndex = measureCoordinates.filter(m => m.x < e.clientX).length - 1
    return measures[selectedMeasureIndex]
  }
}

export const addStyle = element =>
  element.classList ? element.classList.add('selected') : element.selection.forEach(e => addStyle(e))

export const removeStyle = element =>
  element.classList ? element.classList.remove('selected') : element.selection.forEach(e => removeStyle(e))

export const createVerovio = meiUri => {
  const s = document.createElement('script')
  s.type = 'module'
  s.async = true
  const js_lines = [
    'import "https://www.verovio.org/javascript/app/verovio-app.js";',
    `window.app = new Verovio.App(document.getElementById("verovio_container"), {
            defaultView: 'document',
            defaultZoom: 3,
        });`,
    `window.verovioCallback("${meiUri}");`,
  ]
  s.innerHTML = js_lines.join('\n') + '\n'
  document.body.appendChild(s)
}

export const load = mei_uri => {
  fetch(mei_uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    mode: 'cors',
    cache: 'no-cache',
    redirect: 'follow',
  })
    .then(res => res.text())
    .then(res => {
      window.app.loadData(res)
    })
}
