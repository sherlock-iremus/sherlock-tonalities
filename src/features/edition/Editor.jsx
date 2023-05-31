import { Lyrics } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, Collapse, Button } from '@mui/material'
import { Stack } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedNotes } from '../../services/globals'

export const Editor = () => {
  const { selectedNotes } = useSelector(state => state.globals)
  const dispatch = useDispatch()

  return (
    <Collapse in={!!selectedNotes.length} timeout="auto" unmountOnExit>
      <Stack borderRadius={3} bgcolor="white" boxShadow={1}>
        <ListItem
          dense
          secondaryAction={
            <Button size="small" onClick={() => dispatch(setSelectedNotes())}>
              clear
            </Button>
          }
        >
          <ListItemIcon>
            <Lyrics />
          </ListItemIcon>
          <ListItemText
            primary="Current annotation"
            secondary={selectedNotes.length === 1 ? 'One selected note' : selectedNotes.length + ' selected notes'}
          />
        </ListItem>
      </Stack>
    </Collapse>
  )
}
