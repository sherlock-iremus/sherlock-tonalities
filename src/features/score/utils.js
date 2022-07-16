import { ANALYTICAL_ENTITY, ANNOTATION, NOTE, POSITIONNED_NOTE, SCORE, SELECTION, VERTICALITY } from './constants'
import scores from '../../app/scores.json'

export const findKey = item =>
  item &&
  (item.noteIri ||
    item.verticalityIri ||
    item.positionnedNoteIri ||
    item.selectionIri ||
    item.conceptIri ||
    item.propertyIri ||
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
  annotationIri,
}) =>
  (noteIri && NOTE) ||
  (verticalityIri && VERTICALITY) ||
  (positionnedNoteIri && POSITIONNED_NOTE) ||
  (selectionIri && SELECTION) ||
  (analyticalEntityIri && ANALYTICAL_ENTITY) ||
  (scoreIri && SCORE) ||
  (annotationIri && ANNOTATION)

export const sleep = time => new Promise(resolve => setTimeout(resolve, time))

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

export const getScoreLabel = scoreIri => {
  for (const score of scores) if (scoreIri.match(score.scoreIri)) return score.scoreTitle
  return null
}
