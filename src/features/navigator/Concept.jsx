import { ListItem, Collapse, List, IconButton, Chip } from '@mui/material'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedConcepts } from '../../app/services/scoreSlice'

export const Concept = ({ concept }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { selectedConcepts, selectedNotes } = useSelector(state => state.score)

  const isSelected = selectedNotes.length && selectedConcepts.includes(concept.iri)
  const handleClick = () => dispatch(setSelectedConcepts(concept.iri))

  return (
    <>
      <ListItem>
        {concept.subClasses && (
          <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        )}
        <Chip
          label={concept.iri}
          disabled={!selectedNotes.length}
          onClick={handleClick}
          {...(!isSelected ? { variant: 'outlined' } : { onDelete: handleClick })}
        />
      </ListItem>
      {concept.subClasses && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} disablePadding>
            {concept.subClasses.map(subClass => (
              <Concept key={subClass.iri} concept={subClass} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}
