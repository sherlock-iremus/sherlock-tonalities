import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { useGetNoteInfoQuery } from "../../../app/services/sparql"
import { LoadingEntity } from "./LoadingEntity"

export const NoteEntity = props => {
  const { data: noteLabel } = useGetNoteInfoQuery(props.note)

  return noteLabel ? (
        <ListItem disablePadding secondaryAction={props.secondaryAction}>
          <ListItemButton sx={{ cursor: 'default' }}>
            <ListItemText primary={noteLabel} secondary={props.note.slice(props.baseUrl.length)} />
          </ListItemButton>
        </ListItem>
  ) : <LoadingEntity />
}
