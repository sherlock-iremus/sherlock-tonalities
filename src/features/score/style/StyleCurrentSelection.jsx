import { StyleNote } from './StyleNote'

export const StyleCurrentSelection = props =>
  props.items?.map(item => item.noteIri && <StyleNote key={item.noteIri} noteIri={item.noteIri} mode="selected" />) || null
