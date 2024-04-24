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
  note.getElementsByTagName('use')[0]?.x.animVal.value + 140 ||
    note.getElementsByTagName('rect')[0]?.x.animVal.value + 140, // x
  note.getElementsByTagName('use')[0]?.y.animVal.value || note.getElementsByTagName('rect')[0]?.y.animVal.value + 140, // y
]

const getMeasure = node => (node?.classList.contains('measure') ? node : node.parentNode && getMeasure(node.parentNode))

const getSystem = node => (node?.classList.contains('system') ? node : node.parentNode && getSystem(node.parentNode))

const getStaff = node => (node?.classList.contains('staff') ? node : node.parentNode && getStaff(node.parentNode))

const findStaffIndex = staff =>
  [...staff.parentNode.children].filter(node => node.classList.contains('staff')).indexOf(staff)

const staffCoords = staff => ({
  top: staff.getBBox().y,
  bottom: staff.getBBox().y + staff.getBBox().height,
})

export const findInBetweenNotes = (initialNoteId, finalNoteId) => {
  const initialNote = document.getElementById(initialNoteId)
  const finalNote = document.getElementById(finalNoteId)
  const initialSystem = getSystem(initialNote)
  const finalSystem = getSystem(finalNote)
  if (initialSystem.id === finalSystem.id) return findInBetweenNotesInLine(initialNote, finalNote)
  return findInBetweenNotesInSystem(initialNote, finalNote, initialNoteId, finalNoteId)
}

const findInBetweenNotesInLine = (initialNote, finalNote) => {
  const initialStaff = getStaff(initialNote)
  const finalStaff = getStaff(finalNote)

  const yMin = Math.min(staffCoords(initialStaff).top, staffCoords(finalStaff).top)
  const yMax = Math.max(staffCoords(initialStaff).bottom, staffCoords(finalStaff).bottom)
  const xMin = Math.min(noteCoords(initialNote)[0], noteCoords(finalNote)[0])
  const xMax = Math.max(noteCoords(initialNote)[0], noteCoords(finalNote)[0])

  const notes = [...document.querySelectorAll('.note, .rest, .mRest')].map(note => ({
    id: note.id,
    coords: noteCoords(note),
  }))

  const inBetweenNotes = notes.filter(({ coords: [x, y] }) => x >= xMin && x <= xMax && y >= yMin && y <= yMax)
  return inBetweenNotes.map(note => note.id)
}

const findInBetweenNotesInSystem = (initialNote, finalNote, initialNoteId, finalNoteId) => {
  const notes = [...document.querySelectorAll('.note, .rest, .mRest')]
  const notesOffset = notes.map(e => ({ id: e.id, offset: window.tk.getTimeForElement(e.id) }))
  const initialOffset = notesOffset.find(note => note.id === initialNoteId).offset
  const finalOffset = notesOffset.find(note => note.id === finalNoteId).offset
  const min = Math.min(initialOffset, finalOffset)
  const max = Math.max(initialOffset, finalOffset)
  const inBetweenNotes = notesOffset.filter(e => e.offset >= min && e.offset <= max)
  const notesOnTime = inBetweenNotes.map(note => note.id)

  const initialIndex = findStaffIndex(getStaff(initialNote))
  const finalIndex = findStaffIndex(getStaff(finalNote))
  const minIndex = Math.min(initialIndex, finalIndex)
  const maxIndex = Math.max(initialIndex, finalIndex)

  return notesOnTime.filter(note => {
    const noteElement = document.getElementById(note)
    const staffIndex = findStaffIndex(getStaff(noteElement))
    return staffIndex >= minIndex && staffIndex <= maxIndex
  })
}
