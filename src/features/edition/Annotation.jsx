import { Delete } from '@mui/icons-material'
import { Collapse, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ContextChip } from '../../components/ContextChip'
import { setHoveredAnnotation, setSelectedAnnotation } from '../../services/globals'
import { getModel, getUuid, removeBaseIri } from '../../utils'
import { useGetAnnotationsQuery, useGetP140Query } from '../../services/sparql'
import { useDeleteAnnotationMutation } from '../../services/service'

export const Annotation = ({ concept, date, entity, e13, page, annotation }) => {
  const { data: notes } = useGetP140Query(e13, { skip: !e13 })
  const dispatch = useDispatch()
  const { hoveredAnnotation, selectedAnnotation, scoreIri, projectIri } = useSelector(state => state.globals)

  const isSelected = selectedAnnotation?.entity === entity
  const isHovered = hoveredAnnotation?.entity === entity

  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery({ scoreIri, projectIri })

  const removeAnnotation = async () => {
    try {
      await deleteAnnotation(getUuid(annotation)).unwrap()
      await deleteAnnotation(getUuid(e13)).unwrap()
      refetchAnnotations()
    } catch (error) {
      console.log(error)
    }
  }

  if (notes)
    return (
      <ListItem
        key={date}
        onMouseEnter={() => dispatch(setHoveredAnnotation({ entity, page, notes, concept }))}
        onMouseLeave={() => dispatch(setHoveredAnnotation())}
        disablePadding
        secondaryAction={
          <Collapse in={isHovered} timeout="auto" unmountOnExit>
            <IconButton edge="end" onClick={removeAnnotation} color="error">
              <Delete />
            </IconButton>
          </Collapse>
        }
      >
        <ListItemButton
          disabled={isLoading}
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
