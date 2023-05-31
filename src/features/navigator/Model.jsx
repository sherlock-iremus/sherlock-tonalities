import { HistoryEdu, ExpandMore, ChevronRight } from '@mui/icons-material'
import { Button, IconButton, ListItem, ListItemIcon, ListItemText, Collapse, ListSubheader } from '@mui/material'
import { Stack } from '@mui/system'
import { Concepts } from './Concepts'
import { ContextMenu } from './ContextMenu'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import models from '../../config/models.json'
import { Input } from '../../components/Input'
import { setSelectedConcepts } from '../../services/globals'

export const Model = () => {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [contextMenu, setContextMenu] = useState(false)
  const { selectedModelIndex, selectedConcepts } = useSelector(state => state.globals)

  return (
    <Stack borderRadius={3} bgcolor="white" boxShadow={1} minHeight={0}>
      <ContextMenu {...{ contextMenu, setContextMenu }} />
      <ListItem
        dense
        secondaryAction={
          <Button
            size="small"
            onClick={event =>
              setContextMenu(!contextMenu ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null)
            }
          >
            change
          </Button>
        }
      >
        <IconButton edge="start" disableRipple onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <ListItemIcon>
          <HistoryEdu />
        </ListItemIcon>
        <ListItemText primary={models[selectedModelIndex].name} secondary="Selected model" />
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit sx={{ overflow: 'auto' }}>
        <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search" />
        <Stack direction="row" justifyContent="space-between" alignItems="center" pr={0.5}>
          <ListSubheader>Available concepts</ListSubheader>
          {!!selectedConcepts.length && (
            <Button onClick={() => dispatch(setSelectedConcepts())} size="small">
              Clear filter
            </Button>
          )}
        </Stack>
        <Concepts {...{ filter }} />
      </Collapse>
    </Stack>
  )
}
