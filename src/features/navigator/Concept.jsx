import { ListItem, Collapse, List, IconButton, Chip } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeBaseIri } from '../../utils'
import { setSelectedConcepts } from '../../services/globals'

export const Concept = ({ concept, createAnnotation }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { hoveredAnnotation, selectedAnnotation, selectedNotes, selectedConcepts } = useSelector(state => state.globals)

  const isSelected = selectedAnnotation?.concept === concept.iri || selectedConcepts.includes(concept.iri)
  const isHovered = hoveredAnnotation?.concept === concept.iri

  return (
    <>
      <ListItem>
        {concept.subClasses && (
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        )}
        <Chip
          label={removeBaseIri(concept.iri)}
          onClick={() => selectedNotes.length ? createAnnotation(concept.iri) : dispatch(setSelectedConcepts(concept.iri))}
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
