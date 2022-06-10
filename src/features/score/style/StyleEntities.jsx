import { StyleEntity } from './StyleEntity'

const findKey = item => item.noteIri || item.verticalityIri || item.positionnedNoteIri || item.selectionIri || item.annotationIri

export const StyleEntities = ({ items, mode }) =>
  items?.map(item => <StyleEntity key={findKey(item)} {...item} {...{ mode }} />) || null
