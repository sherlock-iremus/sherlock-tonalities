import { NoteItem } from './NoteItem'
import { SelectionItem } from './SelectionItem'
import { PositionnedNoteItem } from './PositionnedNoteItem'
import { VerticalityItem } from './VerticalityItem'

export const Item = props =>
  (props.noteIri && <NoteItem {...props} />) ||
  (props.verticalityIri && <VerticalityItem {...props} />) ||
  (props.positionnedNoteIri && <PositionnedNoteItem {...props} />) ||
  (props.selectionIri && <SelectionItem {...props} />)
