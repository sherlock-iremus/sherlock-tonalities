import { AlignHorizontalCenter, Close, Lyrics, MusicNote, Piano } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { useDispatch } from 'react-redux'
import { useGetVerticalityNotesQuery } from '../../../app/services/sparql'
import { setInspectedVerticality } from '../../slice/scoreSlice'
import { NoteItem } from '../items/NoteItem'
import { LoadingEntity } from './LoadingEntity'

export const VerticalityEntity = props => {
  const dispatch = useDispatch()
  const { data: notes } = useGetVerticalityNotesQuery(props.verticalityIri)
  return notes ? (
    <Box>
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

      <Tooltip title="Create analytical entity">
        <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
          <SpeedDialAction tooltipTitle="Annotate with fundamental" icon={<Piano />} />
          <SpeedDialAction icon={<Lyrics />} tooltipTitle="Create arbitrary analytical entity" />
        </SpeedDial>
      </Tooltip>
    </Box>
  ) : (
    <LoadingEntity />
  )
}
