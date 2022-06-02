import { AlignHorizontalCenter, Close, Lyrics, Piano } from '@mui/icons-material'
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
import { useGetVerticalityPositionnedNotesQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../slice/scoreSlice'
import { PositionnedNoteItem } from '../items/PositionnedNoteItem'
import { LoadingEntity } from './LoadingEntity'

export const VerticalityEntity = props => {
  const dispatch = useDispatch()
  const { data: positionnedNotes } = useGetVerticalityPositionnedNotesQuery(props.verticalityIri)
  return positionnedNotes ? (
    <Box>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton
            disableRipple
            onClick={() => dispatch(setInspectedEntity({ verticalityIri: props.verticalityIri }))}
          >
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
      <List subheader={<ListSubheader>Positionned notes on this verticality</ListSubheader>} dense disablePadding>
        {positionnedNotes.map(e => (
          <PositionnedNoteItem
            key={e.positionnedNoteIri}
            positionnedNoteIri={e.positionnedNoteIri}
            attachedNoteIri={e.attachedNoteIri}
            clickedNoteIri={props.clickedNoteIri}
            baseUrl={props.baseUrl}
          />
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
