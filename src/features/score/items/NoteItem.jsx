import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetNoteInfoQuery } from '../../../app/services/sparql'
import { setInspectedNote } from '../../slice/scoreSlice'
import { LoadingEntity } from '../inspector/LoadingEntity'

export const NoteItem = props => {
  const { data: noteLabel } = useGetNoteInfoQuery(props.noteIri)
  const dispatch = useDispatch()

  return noteLabel ? (
    <ListItem disablePadding secondaryAction={props.secondaryAction}>
      <ListItemButton onClick={() => dispatch(setInspectedNote(props.noteIri))}>
        <ListItemText primary={noteLabel} secondary={props.noteIri.slice(props.baseUrl.length)} />
      </ListItemButton>
    </ListItem>
  ) : (
    <LoadingEntity />
  )
}
