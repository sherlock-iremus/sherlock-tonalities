import { AlignHorizontalCenter, Close } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetVerticalityNotesQuery } from '../../../app/services/sparql'
import { setInspectedVerticality } from '../../slice/scoreSlice'
import { NoteItem } from '../items/NoteItem'
import { LoadingEntity } from './LoadingEntity'

export const VerticalityEntity = props => {
  const dispatch = useDispatch()
  const { data: notes } = useGetVerticalityNotesQuery(props.verticalityIri)
  console.log(notes)
  return notes ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedVerticality(props.verticalityIri))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <AlignHorizontalCenter />
          </ListItemIcon>
          <ListItemText primary="Verticality" secondary={props.verticalityIri.slice(props.baseUrl.length)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Notes in verticality</ListSubheader>} dense disablePadding>
        {notes.map(note => (
          <NoteItem key={note} noteIri={note} baseUrl={props.baseUrl} />
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
