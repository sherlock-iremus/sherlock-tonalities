import { StyleAnalyticalEntity } from './StyleAnalyticalEntity'
import { StyleNote } from './StyleNote'
import { StylePositionnedNote } from './StylePositionnedNote'
import { StyleSelection } from './StyleSelection'
import { StyleVerticality } from './StyleVerticality'

export const StyleEntity = props =>
  (props.noteIri && <StyleNote {...props} />) ||
  (props.verticalityIri && <StyleVerticality {...props} />) ||
  (props.positionnedNoteIri && <StylePositionnedNote {...props} />) ||
  (props.selectionIri && <StyleSelection {...props} />) ||
  (props.analyticalEntityIri && <StyleAnalyticalEntity {...props} />) ||
  null
