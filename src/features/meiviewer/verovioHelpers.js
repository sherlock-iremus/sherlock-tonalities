import { INSPECTION, SELECTION } from './constants'

export const noteCoordinates = note => [
  note.getElementsByTagName('use')[0].x.animVal.value + 140, // x
  note.getElementsByTagName('use')[0].y.animVal.value, // y
]

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
  anchor.setAttribute('x1', noteCoor[0])
  anchor.setAttribute('y1', measureCoor.top)
  anchor.setAttribute('x2', noteCoor[0])
  anchor.setAttribute('y2', measureCoor.bottom)
  anchor.setAttribute('stroke', color)
  anchor.setAttribute('stroke-width', '16')
  beat.referenceNote.appendChild(anchor)
}

export const getMeasure = node =>
  node.classList && node.classList.contains('measure') ? node : node.parentNode && getMeasure(node.parentNode)

export const getSystem = node =>
node.classList && node.classList.contains('system') ? node : node.parentNode && getMeasure(node.parentNode)

export const getNote = node =>
  node.classList && node.classList.contains('note') ? node : node.parentNode && getNote(node.parentNode)

export const addInspectionStyle = element => {
  if (element.referenceNote && !document.getElementById(element.id)) drawBeat(element, INSPECTION)
  element.classList ? element.classList.add('inspected') : element.selection.forEach(e => addInspectionStyle(e))
}

export const removeInspectionStyle = element => {
  if (element.referenceNote && document.getElementById(element.id)) document.getElementById(element.id).remove()
  element.classList ? element.classList.remove('inspected') : element.selection.forEach(e => removeInspectionStyle(e))
}

export const addSelectionStyle = element => {
  if (element.referenceNote && !document.getElementById(element.id)) drawBeat(element, SELECTION)
  element.classList ? element.classList.add('selected') : element.selection.forEach(e => addSelectionStyle(e))
}

export const removeSelectionStyle = element => {
  if (element.referenceNote && document.getElementById(element.id)) document.getElementById(element.id).remove()
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

export const drawAnnotation = selection => {
  const systemNode = getSystem(selection[0])
  systemNode.parentNode.insertBefore(drawAnnotationShape(selection.map(s => noteCoordinates(s))), systemNode)
}

const drawAnnotationShape = points => {
  const hullPadding = 200

  const annotationNode = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  annotationNode.setAttribute('fill', 'salmon')
  annotationNode.setAttribute('fill-opacity', '50%')

  if (points.length == 1) annotationNode.setAttribute('d', roundedHull1(points, hullPadding))
  else if (points.length == 2) annotationNode.setAttribute('d', roundedHull2(points, hullPadding))
  else annotationNode.setAttribute('d', roundedHullN(points, hullPadding))

  return annotationNode
}

const roundedHull1 = (points, hullPadding) => {
  // Returns the path for a rounded hull around a single point (a circle).

  const p1 = [points[0][0], points[0][1] - hullPadding]
  const p2 = [points[0][0], parseInt(points[0][1]) + parseInt(hullPadding)]

  return (
    'M ' +
    p1 +
    ' A ' +
    [hullPadding, hullPadding, '0,0,0', p2].join(',') +
    ' A ' +
    [hullPadding, hullPadding, '0,0,0', p1].join(',')
  )
}

const roundedHull2 = (points, hullPadding) => {
  // Returns the path for a rounded hull around two points (a "capsule" shape).

  const offsetVector = vecScale(hullPadding, unitNormal(points[0], points[1]))
  const invOffsetVector = vecScale(-1, offsetVector)
  // around that note coordinates are not at the centroids

  const p0 = vecSum(points[0], offsetVector)
  const p1 = vecSum(points[1], offsetVector)
  const p2 = vecSum(points[1], invOffsetVector)
  const p3 = vecSum(points[0], invOffsetVector)

  return (
    'M ' +
    p0 +
    ' L ' +
    p1 +
    ' A ' +
    [hullPadding, hullPadding, '0,0,0', p2].join(',') +
    ' L ' +
    p3 +
    ' A ' +
    [hullPadding, hullPadding, '0,0,0', p0].join(',')
  )
}

const roundedHullN = (points, hullPadding) => {
  // Returns the SVG path data string representing the polygon, expanded and rounded.

  if (!points || points.length < 1) return ''
  const segments = new Array(points.length)

  // Calculate each offset (outwards) segment of the convex hull.
  for (let segmentIndex = 0; segmentIndex < segments.length; ++segmentIndex) {
    const p0 = segmentIndex === 0 ? points[points.length - 1] : points[segmentIndex - 1]
    const p1 = points[segmentIndex]

    // Compute the offset vector for the line segment, with length = hullPadding.
    const offset = vecScale(hullPadding, unitNormal(p0, p1))
    segments[segmentIndex] = [vecSum(p0, offset), vecSum(p1, offset)]
  }

  const arcData = 'A ' + [hullPadding, hullPadding, '0,0,0,'].join(',')

  return segments
    .map(
      (segment, index) =>
        (!index ? 'M ' + segments[segments.length - 1][1] + ' ' : '') + arcData + segment[0] + ' L ' + segment[1]
    )
    .join(' ')
}

// Returns the vector 'v' scaled by 'scale'
const vecScale = (scale, v) => [scale * v[0], scale * v[1]]

// Returns the sum of two vectors, or a combination of a point and a vector
const vecSum = (pv1, pv2) => [pv1[0] + pv2[0], pv1[1] + pv2[1]]

// Returns the unit normal to the line segment from p0 to p1.
const unitNormal = (p0, p1) => {
  const n = [p0[1] - p1[1], p1[0] - p0[0]]
  const nLength = Math.sqrt(n[0] * n[0] + n[1] * n[1])
  return [n[0] / nLength, n[1] / nLength]
}
