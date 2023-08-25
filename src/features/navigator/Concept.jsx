import { ListItem, Collapse, List, IconButton, Chip } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeBaseIri } from '../../utils'
import { setSelectedConcepts } from '../../services/globals'

export const Concept = ({ concept, createAnnotation, addAssignment }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { selectedAnnotation, selectedNotes, selectedConcepts, isSubSelecting } = useSelector(state => state.globals)

  const isSelected =
    selectedAnnotation?.assignments.some(a => a.concept === concept.iri) || selectedConcepts.includes(concept.iri)

  const onClick = () => {
    if (selectedAnnotation && !isSelected && !isSubSelecting) addAssignment(concept.iri)
    else if (selectedNotes.length) createAnnotation(concept.iri)
    else dispatch(setSelectedConcepts(concept.iri))
  }

  return (
    <>
      <ListItem>
        {concept.subClasses && (
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        )}
        <Chip
          label={removeBaseIri(concept.iri)}
          {...{ onClick }}
          {...(isSelected ? { color: 'primary' } : { variant: 'outlined' })}
        />
      </ListItem>
      {concept.subClasses && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} dense disablePadding>
            {concept.subClasses.map(subClass => (
              <Concept key={subClass.iri} concept={subClass} {...{ createAnnotation, addAssignment }} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
