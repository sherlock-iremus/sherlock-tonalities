import { Close } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetNoteInfoQuery, useGetNoteSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedNote, setInspectedSelection } from '../../slice/scoreSlice'
import { LoadingEntity } from './LoadingEntity'

export const NoteEntity = props => {
  const { data: noteLabel } = useGetNoteInfoQuery(props.noteIri)
  const { data: selections } = useGetNoteSelectionsQuery(props.noteIri)
  const dispatch = useDispatch()

  return noteLabel ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton onClick={() => dispatch(setInspectedNote(props.noteIri))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemText primary={noteLabel} secondary={props.noteIri.slice(props.baseUrl.length)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Is in selections</ListSubheader>}>
        {selections?.map((selection, index) => (
          <ListItem key={selection.iri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedSelection(selection.iri))}>
              <ListItemText primary={`Selection ${index + 1}`} secondary={selection.iri.slice(props.baseUrl.length)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
