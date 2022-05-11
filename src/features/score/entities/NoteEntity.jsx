import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import {
  useGetNoteInfoQuery,
  useGetNoteSelectionsQuery,
} from '../../../app/services/sparql'
import { setInspectedSelection } from '../../slice/scoreSlice'
import { LoadingEntity } from './LoadingEntity'

export const NoteEntity = props => {
  const { data: noteLabel } = useGetNoteInfoQuery(props.noteIri)
  const { data: selections } = useGetNoteSelectionsQuery(props.noteIri)
  const dispatch = useDispatch()

  return noteLabel ? (
    <>
      <ListItem disablePadding secondaryAction={props.secondaryAction}>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemText primary={noteLabel} secondary={props.noteIri.slice(props.baseUrl.length)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Selections</ListSubheader>}>
        {selections?.map((selection, index) => (
          <ListItem key={selection.iri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedSelection(selection.iri))}>
              <ListItemText
                primary={`Selection ${index + 1}`}
                secondary={selection.iri.slice(props.baseUrl.length)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
