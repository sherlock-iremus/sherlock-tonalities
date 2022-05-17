import { NoteItem } from './NoteItem'
import { SelectionItem } from './SelectionItem'

export const Item = props =>
  (props.noteIri && <NoteItem {...props} />) || (props.selectionIri && <SelectionItem {...props} />)
