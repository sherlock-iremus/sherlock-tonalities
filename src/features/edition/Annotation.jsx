import { Comment } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material'
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
      onMouseEnter={() => dispatch(setHoveredAnnotation(annotation.date))}
      onMouseLeave={() => dispatch(setHoveredAnnotation())}
      disablePadding
      secondaryAction={
        <IconButton edge="end">
          <Comment />
        </IconButton>
      }
    >
      <ListItemButton
        onClick={() => dispatch(setSelectedAnnotation(!isSelected ? annotation.date : null))}
        selected={isSelected}
      >
        {annotation.concepts.map(concept => (
          <ContextChip key={concept} primary={concept} secondary="Guillotel" sx={{ m: 0.2 }} />
        ))}
        <ListItemText
          sx={{ paddingLeft: 1 }}
          secondary={annotation.notes.length === 1 ? 'on one note' : `on ${annotation.notes.length} notes`}
        />
      </ListItemButton>
    </ListItem>
  )
}
