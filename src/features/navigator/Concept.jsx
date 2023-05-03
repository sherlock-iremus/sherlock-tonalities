import { ListItem, Collapse, List, IconButton, Chip } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { removeBaseIri } from '../../utils'

export const Concept = ({ concept, createAnnotation }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { hoveredAnnotation, selectedAnnotation, selectedNotes } = useSelector(state => state.globals)

  const isSelected = selectedAnnotation?.concepts.includes(concept.iri)
  const isHovered = hoveredAnnotation?.concepts.includes(concept.iri)

  return (
    <>
      <ListItem>
        {concept.subClasses && (
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        )}
        <Chip
          label={removeBaseIri(concept.iri)}
          disabled={!selectedNotes.length}
          onClick={() => createAnnotation(concept.iri)}
          {...(isHovered || isSelected ? { color: 'primary' } : { variant: 'outlined' })}
        />
      </ListItem>
      {concept.subClasses && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} dense disablePadding>
            {concept.subClasses.map(subClass => (
              <Concept key={subClass.iri} concept={subClass} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
