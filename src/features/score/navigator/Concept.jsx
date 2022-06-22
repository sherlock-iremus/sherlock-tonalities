import { ListItem, ListItemButton, ListItemText, Collapse, List, IconButton } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

export const Concept = props => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ListItem disablePadding>
        {props.concept.children && (
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        )}
        <ListItemButton
          onClick={() => props.setInspection(props.concept.iri)}
          selected={props.selectedConcept === props.concept.iri}
        >
          <ListItemText primary={props.concept.label} />
        </ListItemButton>
      </ListItem>
      {props.concept.children && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} disablePadding>
            {props.concept.children.map(subClass => (
              <Concept
                key={subClass.iri}
                selectedConcept={props.selectedConcept}
                concept={subClass}
                setInspection={props.setInspection}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
