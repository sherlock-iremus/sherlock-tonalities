import { ListItem, ListItemButton, ListItemText, Collapse, List, IconButton } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

export const Concept = props => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ListItem disablePadding dense>
        <ListItemButton>
          {props.concept.subClasses && (
            <IconButton disableRipple onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ExpandMore /> : <ChevronRight />}
            </IconButton>
          )}
          <ListItemText primary={props.concept.iri} />
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
