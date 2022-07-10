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

export const getScoreLabel = scoreIri => {
  for (const score of scores) if (scoreIri.match(score.scoreTitle)) return score.scoreTitle
  return null
}