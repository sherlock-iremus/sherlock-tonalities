/* eslint-disable react-hooks/exhaustive-deps */
import { AddCircle } from '@mui/icons-material'
import { Collapse, IconButton, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ContextChip } from '../../components/ContextChip'
import { setHoveredAnnotation, setSelectedAnnotation } from '../../services/globals'
import { getModel, getUuid, removeBaseIri } from '../../utils'
import { useGetAnnotationsQuery, useGetP140Query } from '../../services/sparql'
import { useDeleteAnnotationMutation } from '../../services/service'
import { useEffect, useState } from 'react'
import { getId } from '../../utils'

export const Annotation = ({ concept, date, entity, e13, page, annotation }) => {
  const { data: notes } = useGetP140Query(e13, { skip: !e13 })
  const dispatch = useDispatch()
  const { hoveredAnnotation, selectedAnnotation, scoreIri, projectIri, selectedNotes, selectedConcepts } = useSelector(
    state => state.globals
  )

  const isSelected = selectedAnnotation?.entity === entity
  const isHovered = hoveredAnnotation?.entity === entity
  const [isDisabled, setIsDisabled] = useState(false)

  const checkIsDisabled = () => {
    if (selectedConcepts.length) return !selectedConcepts.includes(concept)
    if (selectedNotes.length) {
      if (!selectedNotes.length) return false
      if (selectedNotes.length === notes.length) {
        const intersection = selectedNotes.filter(e => new Set(notes.map(x => getId(x))).has(e))
        if (intersection.length === selectedNotes.length) return false
      }
      return true
    }
    return false
  }

  useEffect(() => {
    setIsDisabled(checkIsDisabled())
  }, [selectedNotes, selectedConcepts, notes])

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
        disabled={isDisabled}
        secondaryAction={
          <Collapse in={isHovered} timeout="auto" unmountOnExit>
            <Tooltip title="Add concept">
              <IconButton edge="end" onClick={removeAnnotation}>
                <AddCircle />
              </IconButton>
            </Tooltip>
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
