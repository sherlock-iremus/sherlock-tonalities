import { ListItem, ListItemButton, ListItemText, Collapse, List, IconButton } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

export const ConceptItem = props => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <ListItem disablePadding dense>
        {props.concept.subClasses && (
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        )}
        <ListItemButton sx={{ cursor: 'default' }} onClick={() => props.setConcept(props.concept)}>
          <ListItemText primary={props.concept.label} />
        </ListItemButton>
      </ListItem>
      {props.concept.subClasses && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} dense disablePadding>
            {props.concept.subClasses.map(subClass => (
              <ConceptItem key={subClass.iri} concept={subClass} setConcept={concept => props.setConcept(concept)} />
            ))}
          </List>
        </Collapse>
      )}
    </div>
  )
}
