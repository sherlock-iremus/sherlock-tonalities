import { HistoryEdu, ExpandMore, ChevronRight } from '@mui/icons-material'
import { Button, IconButton, ListItem, ListItemIcon, ListItemText, Collapse, ListSubheader } from '@mui/material'
import { Stack } from '@mui/system'
import { Concepts } from './Concepts'
import { ContextMenu } from './ContextMenu'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import models from '../../config/models.json'

export const Model = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState(false)
  const { selectedModelIndex } = useSelector(state => state.globals)

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
        <ListSubheader>Available concepts</ListSubheader>
        <Concepts />
      </Collapse>
    </Stack>
  )
}
