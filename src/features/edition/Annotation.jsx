import { Comment } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ContextChip } from '../../components/ContextChip'
import { setHoveredAnnotation, setSelectedAnnotation } from '../../services/globals'

export const Annotation = ({ annotation }) => {
  const { selectedAnnotation } = useSelector(state => state.globals)
  const dispatch = useDispatch()

  const isSelected = selectedAnnotation === annotation

  return (
    <ListItem
      key={annotation.date}
      disablePadding
      onClick={() => dispatch(setSelectedAnnotation(!isSelected ? annotation.date : null))}
      secondaryAction={
        <IconButton edge="end">
          <Comment />
        </IconButton>
      }
    >
      <ListItemButton
        selected={isSelected}
        onMouseEnter={() => dispatch(setHoveredAnnotation(annotation))}
        onMouseLeave={() => dispatch(setHoveredAnnotation())}
      >
        {annotation.concepts.map(concept => (
          <ContextChip key={concept} primary={concept} secondary="Guillotel" sx={{ m: 0.2 }} />
        ))}
      </ListItemButton>
    </ListItem>
  )
}
