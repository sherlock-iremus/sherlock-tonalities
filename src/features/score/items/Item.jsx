import { NoteItem } from './NoteItem'
import { SelectionItem } from './SelectionItem'
import { PositionnedNoteItem } from './PositionnedNoteItem'
import { VerticalityItem } from './VerticalityItem'
import { ClassItem } from './ClassItem'
import { AnnotationItem } from './AnnotationItem'
import { AnalyticalEntityItem } from './AnalyticalEntityItem'

export const Item = props =>
  (props.noteIri && <NoteItem {...props} />) ||
  (props.positionnedNoteIri && <PositionnedNoteItem {...props} />) ||
  (props.verticalityIri && <VerticalityItem {...props} initialIsOpen={false} />) ||
  (props.selectionIri && <SelectionItem {...props} initialIsOpen={false} />) ||
  (props.classIri && <ClassItem {...props} />) ||
  (props.analyticalEntityIri && <AnalyticalEntityItem {...props} />) ||
  (props.annotationIri && <AnnotationItem {...props} />)
