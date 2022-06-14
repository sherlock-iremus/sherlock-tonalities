import { NoteItem } from './NoteItem'
import { SelectionItem } from './SelectionItem'
import { PositionnedNoteItem } from './PositionnedNoteItem'
import { VerticalityEntity } from '../entities/VerticalityEntity'

export const Item = props =>
  (props.noteIri && <NoteItem {...props} />) ||
  (props.verticalityIri && <VerticalityEntity {...props} />) ||
  (props.positionnedNoteIri && <PositionnedNoteItem {...props} />) ||
  (props.selectionIri && <SelectionItem {...props} />)
