import { ListItem, ListItemButton, ListItemText, ListItemIcon, Collapse, List } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

export const ConceptItem = props => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setIsOpen(!isOpen)} sx={{ cursor: 'default' }}>
          <ListItemIcon>{props.concept.subClasses && (isOpen ? <ExpandMore /> : <ChevronRight />)}</ListItemIcon>
          <ListItemText primary={props.concept.label} />
        </ListItemButton>
      </ListItem>
      {props.concept.subClasses && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} dense disablePadding>
            {props.concept.subClasses.map(subClass =>
              <ConceptItem key={subClass.iri} concept={subClass} />
            )}
          </List>
        </Collapse>
      )}
    </div>
  )
}
