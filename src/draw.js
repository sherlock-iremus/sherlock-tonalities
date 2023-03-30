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
  note.getElementsByTagName('use')[0].x.animVal.value + 140, // x
  note.getElementsByTagName('use')[0].y.animVal.value, // y
]

const getSystem = node => (node?.classList.contains('system') ? node : node.parentNode && getSystem(node.parentNode))

const getStaff = node => (node?.classList.contains('staff') ? node : node.parentNode && getStaff(node.parentNode))

const staffCoords = staff => ({
  top: staff.getBBox().y,
  bottom: staff.getBBox().y + staff.getBBox().height,
  absolute: staff.children[0].getBBox().y,
})

export const findInBetweenNotes = (initialNoteId, finalNoteId) => {
  const initialNote = document.getElementById(initialNoteId)
  const finalNote = document.getElementById(finalNoteId)
  if (getSystem(initialNote).id === getSystem(finalNote).id) {
    const { top: yMin, bottom: yMax, absolute } = staffCoords(getStaff(initialNote))
    if (staffCoords(getStaff(finalNote)).absolute === absolute) {
      const xMin = Math.min(noteCoords(initialNote)[0], noteCoords(finalNote)[0])
      const xMax = Math.max(noteCoords(initialNote)[0], noteCoords(finalNote)[0])
      const notes = [...document.querySelectorAll('.note')].map(note => ({ id: note.id, coords: noteCoords(note) }))
      const inBetweenNotes = notes.filter(({ coords: [x, y] }) => x > xMin && x < xMax && y > yMin && y < yMax)
      return [finalNoteId, ...inBetweenNotes.map(note => note.id)]
    }
  }
}
