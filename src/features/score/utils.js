import { ANALYTICAL_ENTITY, NOTE, POSITIONNED_NOTE, SCORE, SELECTION, VERTICALITY } from './constants'

export const findKey = item =>
  item &&
  (item.noteIri ||
    item.verticalityIri ||
    item.positionnedNoteIri ||
    item.selectionIri ||
    item.conceptIri ||
    item.annotationIri ||
    item.analyticalEntityIri ||
    item.contributorIri ||
    item.scoreIri)

export const findType = ({
  noteIri,
  verticalityIri,
  positionnedNoteIri,
  selectionIri,
  scoreIri,
  analyticalEntityIri,
}) =>
  (noteIri && NOTE) ||
  (verticalityIri && VERTICALITY) ||
  (positionnedNoteIri && POSITIONNED_NOTE) ||
  (selectionIri && SELECTION) ||
  (analyticalEntityIri && ANALYTICAL_ENTITY) ||
  (scoreIri && SCORE)

export const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const groupByOld = (list, key) => list.reduce((prev, curr) => ({ ...prev, [curr[key]]: [...(prev[key] || []), curr] }), {})

export const groupBy = (list, key) => {
  return list.reduce((prev, curr) => {
    return {
      ...prev,
      [curr[key]]: [...(prev[key] || []), curr],
    }
  }, {})
}

export const stringToColor = string => {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) hash = string.charCodeAt(i) + ((hash << 5) - hash)

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}
