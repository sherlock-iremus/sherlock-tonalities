import { AlignHorizontalCenter, Close, ExpandLess, ExpandMore, Lyrics, Piano } from '@mui/icons-material'
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetVerticalityPositionnedNotesQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../slice/scoreSlice'
import { PositionnedNoteItem } from '../items/PositionnedNoteItem'
import { LoadingEntity } from './LoadingEntity'

export const VerticalityEntity = ({ verticalityIri, baseUrl, clickedNoteIri }) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const { data: positionnedNotes } = useGetVerticalityPositionnedNotesQuery(verticalityIri)
  return positionnedNotes ? (
    <Box>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ verticalityIri }))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <AlignHorizontalCenter />
          </ListItemIcon>
          <Tooltip title="Positionned notes">
            <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandLess /> : <ExpandMore />}</IconButton>
          </Tooltip>
          <ListItemText primary="Verticality" secondary={verticalityIri.slice(baseUrl.length)} />
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List sx={{ pl: 2 }} dense disablePadding>
          {positionnedNotes.map(e => (
            <PositionnedNoteItem
              key={e.positionnedNoteIri}
              positionnedNoteIri={e.positionnedNoteIri}
              attachedNoteIri={e.attachedNoteIri}
              clickedNoteIri={clickedNoteIri}
              baseUrl={baseUrl}
            />
          ))}
        </List>
      </Collapse>

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
