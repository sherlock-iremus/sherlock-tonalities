import { NoteItem } from "./NoteItem";

export const Item = props => (
  <>
    {props.noteIri && <NoteItem {...props} />}
  </>
)
