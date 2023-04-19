import { ListItem, ListItemButton, ListItemText, Collapse, List, IconButton } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'

export const Concept = props => {
  const [isOpen, setIsOpen] = useState(false)
  const { attributes, listeners, setNodeRef } = useDraggable({ id: props.concept.iri })

  return (
    <>
      <ListItem disablePadding dense>
        <ListItemButton>
          {props.concept.subClasses && (
            <IconButton edge="start" disableRipple onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ExpandMore /> : <ChevronRight />}
            </IconButton>
          )}
          <ListItemText ref={setNodeRef} {...listeners} {...attributes} primary={props.concept.iri} />
        </ListItemButton>
      </ListItem>
      {props.concept.subClasses && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} disablePadding>
            {props.concept.subClasses.map(subClass => (
              <Concept key={subClass.iri} concept={subClass} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
