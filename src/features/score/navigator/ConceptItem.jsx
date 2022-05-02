import { ListItem, ListItemButton, ListItemText, Collapse, List, IconButton } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

export const ConceptItem = props => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <ListItem disablePadding>
        {props.concept.subClasses && (
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        )}
        <ListItemButton onClick={() => props.setInspection(props.concept.iri)} selected={props.selectedConcept === props.concept.iri}>
          <ListItemText primary={props.concept.label} />
        </ListItemButton>
      </ListItem>
      {props.concept.subClasses && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} disablePadding>
            {props.concept.subClasses.map(subClass => (
              <ConceptItem
                key={subClass.iri}
                selectedConcept={props.selectedConcept}
                concept={subClass}
                setInspection={clickedConcept => props.setInspection(clickedConcept)}
              />
            ))}
          </List>
        </Collapse>
      )}
    </div>
  )
}
