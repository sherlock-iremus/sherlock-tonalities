import { MusicNote } from "@mui/icons-material"
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { useGetNoteInfoQuery } from "../../app/services/sparql"
import { LoadingNode } from "./LoadingNode"

export const NoteNode = props => {
  const { data: noteLabel } = useGetNoteInfoQuery(props.note)

  return noteLabel ? (
        <ListItem disablePadding>
          <ListItemButton sx={{ cursor: 'default' }}>
            <ListItemIcon>
              <MusicNote />
            </ListItemIcon>
            <ListItemText primary={noteLabel} secondary={props.note} />
          </ListItemButton>
        </ListItem>
  ) : <LoadingNode />
}
