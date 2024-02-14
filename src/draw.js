export const circleShape = (points, hullPadding) => {
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

export const noteCoords = note => [
  note.getElementsByTagName('use')[0]?.x.animVal.value + 140, // x
  note.getElementsByTagName('use')[0]?.y.animVal.value, // y
]

const getSystem = node => (node?.classList.contains('system') ? node : node.parentNode && getSystem(node.parentNode))

const getStaff = node => (node?.classList.contains('staff') ? node : node.parentNode && getStaff(node.parentNode))

const getLayer = node => (node?.classList.contains('layer') ? node : node.parentNode && getStaff(node.parentNode))

const staffCoords = staff => ({
  top: staff.getBBox().y,
  bottom: staff.getBBox().y + staff.getBBox().height,
})
