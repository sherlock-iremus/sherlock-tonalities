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