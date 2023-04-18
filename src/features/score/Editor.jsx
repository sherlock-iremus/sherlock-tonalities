import { HistoryEdu, Lyrics, Delete } from '@mui/icons-material'
import {
  Button,
  IconButton,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Collapse,
} from '@mui/material'
import { Stack } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedNotes } from '../../app/services/scoreSlice'

export const Editor = () => {
  const { selectedNotes } = useSelector(state => state.score)
  const dispatch = useDispatch()

  return (
    <Collapse in={selectedNotes.length} timeout="auto" unmountOnExit>
      <Stack borderRadius={3} bgcolor="white" boxShadow={1} overflow="hidden">
        <ListItem
          dense
          disablePadding
          secondaryAction={
            <>
              <Button color="text" size="small" onClick={() => dispatch(setSelectedNotes())}>
                undo
              </Button>
              <Button>Create</Button>
            </>
          }
        >
          <ListItemButton selected>
            <ListItemIcon>
              <Lyrics />
            </ListItemIcon>
            <ListItemText
              primary="New annotation"
              secondary={selectedNotes.length === 1 ? 'One selected note' : selectedNotes.length + ' selected notes'}
            />
          </ListItemButton>
        </ListItem>
        <ListSubheader>Assigned concepts</ListSubheader>
        <ListItem
          dense
          disablePadding
          secondaryAction={
            <IconButton>
              <Delete />
            </IconButton>
          }
        >
          <ListItemButton>
            <ListItemIcon>
              <HistoryEdu />
            </ListItemIcon>
            <ListItemText primary="Cadence" secondary="Guillotel 2022" />
          </ListItemButton>
        </ListItem>
      </Stack>
    </Collapse>
  )
}
