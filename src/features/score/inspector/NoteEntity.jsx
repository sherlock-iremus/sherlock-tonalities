import { ListItem, ListItemButton, ListItemText } from "@mui/material"
import { useGetNoteInfoQuery } from "../../../app/services/sparql"
import { LoadingEntity } from "./LoadingEntity"

export const NoteEntity = props => {
  const { data: noteLabel } = useGetNoteInfoQuery(props.noteIri)

  return noteLabel ? (
        <ListItem disablePadding secondaryAction={props.secondaryAction}>
          <ListItemButton sx={{ cursor: 'default' }}>
            <ListItemText primary={noteLabel} secondary={props.noteIri.slice(props.baseUrl.length)} />
          </ListItemButton>
        </ListItem>
  ) : <LoadingEntity />
}
