import { Edit, Comment } from '@mui/icons-material'
import { Collapse, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ContextChip } from '../../components/ContextChip'
import { setHoveredAnnotation, setSelectedAnnotation } from '../../services/globals'
import { getModel, removeBaseIri } from '../../utils'
import { useGetP140Query } from '../../services/sparql'

export const Annotation = ({ concept, date, entity, e13, page }) => {
  const { data: notes } = useGetP140Query(e13, { skip: !e13 })
  const dispatch = useDispatch()
  const { hoveredAnnotation, selectedAnnotation } = useSelector(state => state.globals)

  const isSelected = selectedAnnotation?.entity === entity
  const isHovered = hoveredAnnotation?.entity === entity

  if (notes)
    return (
      <ListItem
        key={date}
        onMouseEnter={() => dispatch(setHoveredAnnotation({ entity, page, notes, concept }))}
        onMouseLeave={() => dispatch(setHoveredAnnotation())}
        disablePadding
        secondaryAction={
          <Collapse in={isHovered} timeout="auto" unmountOnExit>
            <IconButton>
              <Edit />
            </IconButton>
            <IconButton edge="end">
              <Comment />
            </IconButton>
          </Collapse>
        }
      >
        <ListItemButton
          onClick={() => dispatch(setSelectedAnnotation(!isSelected ? { entity, page, notes, concept } : null))}
          selected={isSelected}
        >
          <ContextChip key={concept} primary={removeBaseIri(concept)} secondary={getModel(concept)} sx={{ m: 0.2 }} />
          <ListItemText
            sx={{ paddingLeft: 1 }}
            secondary={notes.length === 1 ? 'on one note' : `on ${notes.length} notes`}
          />
        </ListItemButton>
      </ListItem>
    )
}
