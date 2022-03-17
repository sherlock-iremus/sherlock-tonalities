import { INSPECTION, SELECTION } from "./constants"

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

export const noteCoordinates = note => ({
  x: note.getElementsByTagName('use')[0].x.animVal.value + 140,
  y: note.getElementsByTagName('use')[0].y.animVal.value,
})

export const measureCoordinates = measure => ({
  top: measure.getBBox().y,
  bottom: measure.getBBox().y + measure.getBBox().height,
})

export const drawBeat = (beat, mode) => {
  const noteCoor = noteCoordinates(beat.referenceNote)
  const measureCoor = measureCoordinates(getMeasure(beat.referenceNote))

  const color = mode === 'INSPECTION' ? 'red' : 'blue'

  const anchor = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  anchor.setAttribute('id', beat.id)
  anchor.setAttribute('x1', noteCoor.x)
  anchor.setAttribute('y1', measureCoor.top)
  anchor.setAttribute('x2', noteCoor.x)
  anchor.setAttribute('y2', measureCoor.bottom)
  anchor.setAttribute('stroke', color)
  anchor.setAttribute('stroke-width', '16')
  beat.referenceNote.append(anchor)
}

export const getMeasure = node => {
  if (node.classList.contains('measure')) return node
  if (node.parentNode) return getMeasure(node.parentNode)
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

export const addInspectionStyle = element => {
  if (element.referenceNote && !document.getElementById(element.id)) drawBeat(element, INSPECTION)
  element.classList ? element.classList.add('inspected') : element.selection.forEach(e => addInspectionStyle(e))
}

export const removeInspectionStyle = element => {
  if (element.referenceNote) document.getElementById(element.id).remove()
  element.classList ? element.classList.remove('inspected') : element.selection.forEach(e => removeInspectionStyle(e))
}

export const addSelectionStyle = element => {
  if (element.referenceNote && !document.getElementById(element.id)) drawBeat(element, SELECTION)
  element.classList ? element.classList.add('selected') : element.selection.forEach(e => addSelectionStyle(e))
}

export const removeSelectionStyle = element => {
  if (element.referenceNote) document.getElementById(element.id).remove()
  element.classList ? element.classList.remove('selected') : element.selection.forEach(e => removeSelectionStyle(e))
}

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
