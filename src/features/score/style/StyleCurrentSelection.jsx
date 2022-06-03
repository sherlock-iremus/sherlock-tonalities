import { StyleNote } from './StyleNote'
import { StyleVerticality } from './StyleVerticality'

export const StyleCurrentSelection = props =>
  props.items?.map(
    item =>
      (item.noteIri && <StyleNote key={item.noteIri} noteIri={item.noteIri} mode="selected" />) ||
      (item.verticalityIri && (
        <StyleVerticality
          key={item.verticalityIri}
          verticalityIri={item.verticalityIri}
          clickedNoteIri={item.clickedNoteIri}
          mode="selected"
        />
      ))
  ) || null
