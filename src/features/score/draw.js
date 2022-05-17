export const drawSelection = (selection, selectionIri, scoreIri) => {
  const notes = selection.map(s => document.getElementById(s?.noteIri.slice(scoreIri.length + 1)))
  if (notes.length) {
    const hullPadding = 300
    const selectionNode = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    selectionNode.setAttribute('id', selectionIri)
    const points = notes.map(s => s && noteCoordinates(s))
    points.forEach(p => {
      const node = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      node.setAttribute('fill', 'purple')
      node.setAttribute('fill-opacity', '30%')
      node.setAttribute('d', roundedHull(p, hullPadding))
      selectionNode.appendChild(node)
    })
    const systemNode = getSystem(notes[0])
    systemNode.parentNode.insertBefore(selectionNode, systemNode)
  }
}

const noteCoordinates = note => [
  note.getElementsByTagName('use')[0].x.animVal.value + 140, // x
  note.getElementsByTagName('use')[0].y.animVal.value, // y
]

const roundedHull = (points, hullPadding) => {
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

const getSystem = node =>
  node.classList && node.classList.contains('system') ? node : node.parentNode && getMeasure(node.parentNode)

const getMeasure = node =>
  node.classList && node.classList.contains('measure') ? node : node.parentNode && getMeasure(node.parentNode)
