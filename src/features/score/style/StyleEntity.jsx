import { StyleAnalyticalEntity } from './StyleAnalyticalEntity'
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
  attachedNoteIri,
  analyticalEntityIri
}) =>
  (noteIri && <StyleNote {...{ noteIri, mode }} />) ||
  (verticalityIri && <StyleVerticality {...{ verticalityIri, clickedNoteIri, mode }} />) ||
  (positionnedNoteIri && <StylePositionnedNote {...{ positionnedNoteIri, clickedNoteIri, attachedNoteIri, mode }} />) ||
  (selectionIri && <StyleSelection {...{ selectionIri, mode }} />) ||
  (analyticalEntityIri && <StyleAnalyticalEntity {...{ analyticalEntityIri, mode }} />) ||
  null
