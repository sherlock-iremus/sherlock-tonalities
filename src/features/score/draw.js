import { INSPECTED, SELECTED } from './constants'
import { COLOR_INSPECTED, COLOR_SELECTED } from './mei.css'
import { sleep } from './utils'

export const drawSelection = async (selection, selectionIri, scoreIri, mode, contributorIri) => {
  if (selection.find(e => e.noteIri)) {
    const notes = selection.map(s => document.getElementById(s?.noteIri?.slice(scoreIri.length + 1))).filter(Boolean)

    if (!notes.length) {
      const pages = Array.from(document.getElementsByClassName('vrv-ui-page-wrapper'))
      for (const page of pages) {
        if (selection.find(s => document.getElementById(s?.noteIri?.slice(scoreIri.length + 1)))) break
        await sleep(100)
        page.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      }
    } else {
      const hullPadding = 300
      const selectionNode = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      selectionNode.setAttribute('id', selectionIri)
      const points = notes.map(s => s && noteCoords(s))
      points.length &&
        points.forEach(p => {
          const node = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          node.setAttribute('fill', (mode === INSPECTED && COLOR_INSPECTED) || (mode === SELECTED && COLOR_SELECTED))
          node.setAttribute('fill-opacity', '30%')
          node.setAttribute('d', circleShape(p, hullPadding))
          selectionNode.appendChild(node)
        })
      if (contributorIri) {
        const contributorNode = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        contributorNode.setAttribute('id', contributorIri)
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        circle.setAttribute('fill', 'blue') // contributorColor
        circle.setAttribute('d', drawContributor(points))
        contributorNode.appendChild(circle)
        
        const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        emoji.setAttribute('content', '🍔') // contributorEmoji
        
        selectionNode.appendChild(contributorNode)
      }
      const systemNode = getSystem(notes[0])
      systemNode.parentNode.insertBefore(selectionNode, systemNode)
    }
  }
}

export const drawContributor = points => {
  let lowest = points[0].y
  let highest = points[0].y
  for (const point in points) {
    if (point.y < lowest) lowest = point.y
    if (point.y > highest) highest = point.y
  }
  return circleShape([SIDE_X, highest - lowest], 500)
}

export const drawPositionnedNote = (positionnedNoteIri, clickedNote, mode) => {
  const noteCoordinates = noteCoords(clickedNote)
  const measureCoordinates = measureCoords(getMeasure(clickedNote))

  const anchor = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  anchor.setAttribute('id', positionnedNoteIri)
  anchor.setAttribute('x1', noteCoordinates[0])
  anchor.setAttribute('y1', measureCoordinates.top)
  anchor.setAttribute('x2', noteCoordinates[0])
  anchor.setAttribute('y2', measureCoordinates.bottom)
  anchor.setAttribute('stroke', (mode === 'inspected' && COLOR_INSPECTED) || (mode === 'selected' && COLOR_SELECTED))
  anchor.setAttribute('stroke-width', '30')

  getSystem(clickedNote).appendChild(anchor)
}

export const drawVerticality = (verticalityIri, clickedNote, mode) => {
  const noteCoordinates = noteCoords(clickedNote)
  const measureCoordinates = measureCoords(getMeasure(clickedNote))

  const padding = 300
  const points = [
    [noteCoordinates[0], measureCoordinates.top],
    [noteCoordinates[0], measureCoordinates.bottom],
  ]

  const anchor = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  anchor.setAttribute('id', verticalityIri)
  anchor.setAttribute('d', capsuleShape(points, padding))
  anchor.setAttribute('fill', (mode === 'inspected' && COLOR_INSPECTED) || (mode === 'selected' && COLOR_SELECTED))
  anchor.setAttribute('fill-opacity', '30%')

  getSystem(clickedNote).appendChild(anchor)
}

const noteCoords = note => [
  note.getElementsByTagName('use')[0].x.animVal.value + 140, // x
  note.getElementsByTagName('use')[0].y.animVal.value, // y
]

const measureCoords = measure => ({
  top: measure.getBBox().y,
  bottom: measure.getBBox().y + measure.getBBox().height,
})

const circleShape = (points, hullPadding) => {
  const p1 = [points[0], points[1] - hullPadding]
  const p2 = [points[0], parseInt(points[1]) + parseInt(hullPadding)]
  return (
    'M ' +
    p1 +
    ' A ' +
    [hullPadding, hullPadding, '0,0,0', p2].join(',') +
    ' A ' +
    [hullPadding, hullPadding, '0,0,0', p1].join(',')
  )
}

const capsuleShape = (points, hullPadding) => {
  const offsetVector = vecScale(hullPadding, unitNormal(points[0], points[1]))
  const invOffsetVector = vecScale(-1, offsetVector)

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

const getSystem = node =>
  node.classList && node.classList.contains('system') ? node : node.parentNode && getMeasure(node.parentNode)

const getMeasure = node =>
  node.classList && node.classList.contains('measure') ? node : node.parentNode && getMeasure(node.parentNode)

const vecScale = (scale, v) => [scale * v[0], scale * v[1]]

const vecSum = (pv1, pv2) => [pv1[0] + pv2[0], pv1[1] + pv2[1]]

const unitNormal = (p0, p1) => {
  const n = [p0[1] - p1[1], p1[0] - p0[0]]
  const nLength = Math.sqrt(n[0] * n[0] + n[1] * n[1])
  return [n[0] / nLength, n[1] / nLength]
}
