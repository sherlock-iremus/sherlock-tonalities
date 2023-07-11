/* eslint-disable react-hooks/exhaustive-deps */
import { Delete, MarkChatUnread } from '@mui/icons-material'
import { Collapse, IconButton, ListItem, ListItemButton, ListItemText, Stack, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setHoveredAnnotation, setSelectedAnnotation } from '../../services/globals'
import { getUuid } from '../../utils'
import { useGetAnnotationsQuery, useGetAssignmentsQuery, useGetP140Query } from '../../services/sparql'
import { useDeleteAnnotationMutation } from '../../services/service'
import { useEffect, useState } from 'react'
import { getId } from '../../utils'
import { Assignment } from '../items/Assignment'

export const Annotation = ({ annotation, entity, date, page, openAnnotation }) => {
  const { data: notes } = useGetP140Query(annotation, { skip: !annotation })
  const { data: assignments, refetch } = useGetAssignmentsQuery(entity, { skip: !entity })
  const dispatch = useDispatch()
  const { hoveredAnnotation, selectedAnnotation, scoreIri, projectIri, selectedNotes, selectedConcepts } = useSelector(
    state => state.globals
  )

  const isSelected = selectedAnnotation?.entity === entity
  const isHovered = hoveredAnnotation?.entity === entity
  const [isDisabled, setIsDisabled] = useState(false)

  const checkIsDisabled = () => {
    if (isLoading) return true
    if (selectedConcepts.length) return assignments?.some(({ concept }) => !selectedConcepts.includes(concept))
    if (selectedNotes.length) return !notes.some(e => selectedNotes.includes(getId(e)))

    return false
  }

  useEffect(() => {
    setIsDisabled(checkIsDisabled())
  }, [selectedNotes, selectedConcepts, notes, assignments])

  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery({ scoreIri, projectIri })

  const removeAnnotation = async () => {
    try {
      await deleteAnnotation(getUuid(annotation)).unwrap()
      refetchAnnotations()
    } catch (error) {
      console.log(error)
    }
  }

  if (notes)
    return (
      <ListItem
        key={date}
        onMouseEnter={() => dispatch(setHoveredAnnotation({ entity, page, notes, assignments }))}
        onMouseLeave={() => dispatch(setHoveredAnnotation())}
        disablePadding
        sx={{ '& .MuiListItemSecondaryAction-root': { top: 36 } }}
        secondaryAction={
          <Collapse in={isHovered} timeout="auto" unmountOnExit>
            <Tooltip title="Delete entity">
              <IconButton onClick={removeAnnotation} size="small">
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title="View comments">
              <IconButton onClick={openAnnotation} size="small">
                <MarkChatUnread />
              </IconButton>
            </Tooltip>
          </Collapse>
        }
      >
        <Stack flex={1} borderRadius={3} bgcolor="white" boxShadow={1} overflow="hidden" margin={1}>
          <ListItemButton
            dense
            disabled={isDisabled}
            onClick={() => dispatch(setSelectedAnnotation(!isSelected ? { entity, page, notes, assignments } : null))}
            selected={isSelected}
          >
            <Stack flex={1} spacing={1}>
              <ListItemText
                sx={{ paddingLeft: 1 }}
                primary="Analytical entity"
                secondary={notes.length === 1 ? 'with one note' : `with ${notes.length} notes`}
              />
              {assignments?.map(assignment => (
                <Assignment key={assignment.assignment} {...assignment} refetch={refetch} />
              ))}
            </Stack>
          </ListItemButton>
        </Stack>
      </ListItem>
    )
}
