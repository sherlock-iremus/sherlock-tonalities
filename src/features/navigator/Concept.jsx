import { ListItem, Collapse, List, IconButton, Chip } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAnnotation } from '../../services/globals'

export const Concept = ({ concept }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { hoveredAnnotation, selectedAnnotation, selectedNotes } = useSelector(state => state.globals)

  const isSelected = selectedAnnotation?.concepts.includes(concept.iri)
  const isHovered = hoveredAnnotation?.concepts.includes(concept.iri)

  const createAnnotation = () => {
    const offsets = selectedNotes.map(note => window.tk.getTimeForElement(note))
    const firstNote = selectedNotes[offsets.findIndex(e => e === Math.min(offsets))]
    const page = window.tk.getPageWithElement(firstNote)
    dispatch(addAnnotation({ concept: concept.iri, page }))
  }

  return (
    <>
      <ListItem>
        {concept.subClasses && (
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        )}
        <Chip
          label={concept.iri}
          disabled={!selectedNotes.length}
          onClick={createAnnotation}
          {...(isHovered && { color: 'text' })}
          {...(isSelected && { color: 'primary' })}
          {...(!isHovered && !isSelected && { variant: 'outlined' })}
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
