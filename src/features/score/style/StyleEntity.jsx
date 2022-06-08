import { StyleAnnalyticalEntity } from './StyleAnnalyticalEntity'
import { StyleNote } from './StyleNote'
import { StylePositionnedNote } from './StylePositionnedNote'
import { StyleSelection } from './StyleSelection'
import { StyleVerticality } from './StyleVerticality'

export const StyleEntity = ({
  mode,
  noteIri,
  verticalityIri,
  positionnedNoteIri,
  selectionIri,
  annotationIri,
  clickedNoteIri,
}) =>
  (noteIri && <StyleNote {...{ noteIri, mode }} />) ||
  (verticalityIri && <StyleVerticality {...{ verticalityIri, clickedNoteIri, mode }} />) ||
  (positionnedNoteIri && <StylePositionnedNote {...{ positionnedNoteIri, clickedNoteIri, attachedNoteIri, mode }} />) ||
  (selectionIri && <StyleSelection {...{ selectionIri, mode }} />) ||
  (annotationIri && <StyleAnnalyticalEntity {...{ annotationIri, mode }} />) ||
  null
