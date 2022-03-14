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
      } else if (node.classList.contains('note') && node.classList.contains('focused')) {
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
  icon.innerHTML =
    '<path stroke-linecap=&#34;round&#34; stroke-linejoin=&#34;round&#34; stroke-width=&#34;2&#34; d=&#34;M19 9l-7 7-7-7&#34; />'
  icon.setAttributeNS(null, 'id', 'measure')
  measure.appendChild(icon)
}

export const drawBeat = beat => beat.forEach(note => document.getElementById(note).classList.add('inspected'))

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

export const addInspectionStyle = element =>
  element.classList ? element.classList.add('inspected') : element.selection.forEach(e => addInspectionStyle(e))

export const removeInspectionStyle = element =>
  element.classList ? element.classList.remove('inspected') : element.selection.forEach(e => removeInspectionStyle(e))

export const addSelectionStyle = element =>
  element.classList ? element.classList.add('selected') : element.selection.forEach(e => addSelectionStyle(e))

export const removeSelectionStyle = element =>
  element.classList ? element.classList.remove('selected') : element.selection.forEach(e => removeSelectionStyle(e))

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
