import { HistoryEdu, ExpandMore, ChevronRight } from '@mui/icons-material'
import { Button, IconButton, ListItem, ListItemIcon, ListItemButton, ListItemText, Collapse } from '@mui/material'
import { Stack } from '@mui/system'
import { Concepts } from '../navigator/Concepts'
import { useState } from 'react'

export const Model = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Stack borderRadius={3} bgcolor="white" boxShadow={1} minHeight={0} overflow="auto">
      <ListItem
        dense
        disablePadding
        secondaryAction={
          <Button size="small" disabled>
            change
          </Button>
        }
      >
        <ListItemButton selected>
          <IconButton edge="start" disableRipple onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
          <ListItemIcon>
            <HistoryEdu />
          </ListItemIcon>
          <ListItemText primary="Guillotel 2022" secondary="Selected model" />
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Concepts flex={1} />
      </Collapse>
    </Stack>
  )
}
