import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useGetNoteInfoQuery, useGetNoteSelectionsQuery } from '../../../app/services/sparql'
import { LoadingEntity } from './LoadingEntity'

export const NoteEntity = props => {
  const { data: noteLabel } = useGetNoteInfoQuery(props.noteIri)
  const { data: selections } = useGetNoteSelectionsQuery(props.noteIri)

  return noteLabel ? (
    <>
      <ListItem disablePadding secondaryAction={props.secondaryAction}>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemText primary={noteLabel} secondary={props.noteIri.slice(props.baseUrl.length)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Selections</ListSubheader>}>
        {selections?.map(selection => (
          <ListItem key={selection.iri} disablePadding>
            <ListItemButton>
              <ListItemText primary={selection.created} secondary={selection.iri} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
