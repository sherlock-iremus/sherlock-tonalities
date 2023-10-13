/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel } from '@mui/icons-material'
import { Collapse, IconButton, ListItem, ListItemButton, ListItemText, Stack, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setHoveredAnnotation, setSelectedAnnotation } from '../../services/globals'
import { getUuid } from '../../utils'
import { useGetAnnotationsQuery, useGetAssignmentsQuery, useGetP140Query } from '../../services/sparql'
import { useDeleteAnnotationMutation, useGetUserIdQuery } from '../../services/service'
import { useEffect, useState } from 'react'
import { getId } from '../../utils'
import { Assignment } from '../items/Assignment'
import { ContributorItem } from '../items/ContributorItem'

export const Annotation = ({ annotation, entity, date, page, author, isSubEntity, color }) => {
  const { data: notes } = useGetP140Query(annotation, { skip: !annotation })
  const { data: assignments, refetch } = useGetAssignmentsQuery(entity, { skip: !entity })
  const dispatch = useDispatch()
  const { hoveredAnnotation, selectedAnnotation, scoreIri, projectIri, selectedNotes, selectedConcepts, noteCount } =
    useSelector(state => state.globals)

  const isScoreSelected = notes?.includes(scoreIri) || false
  const isSelected = selectedAnnotation?.entity === entity || false
  const isHovered = (!isSubEntity && hoveredAnnotation?.entity === entity) || false
  const [isDisabled, setIsDisabled] = useState(false)

  const { data: userId } = useGetUserIdQuery()
  const canDelete = userId === getUuid(author)

  const checkIsDisabled = () => {
    if (isLoading) return true
    if (selectedConcepts.length) return assignments?.some(({ concept }) => !selectedConcepts.includes(concept))
    if (selectedNotes.length) return !notes.some(e => selectedNotes.includes(getId(e)))

    return false
  }

  useEffect(() => {
    if (notes) setIsDisabled(checkIsDisabled())
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
        component="div"
        key={date}
        onMouseEnter={() => dispatch(setHoveredAnnotation({ entity, page, notes, assignments }))}
        onMouseLeave={() => dispatch(setHoveredAnnotation())}
        disablePadding
        sx={{ '& .MuiListItemSecondaryAction-root': { top: 30 } }}
        secondaryAction={
          <Collapse in={isHovered} timeout="auto" unmountOnExit>
            {canDelete ? (
              <Tooltip title="Delete entity">
                <IconButton onClick={removeAnnotation} size="small">
                  <Cancel />
                </IconButton>
              </Tooltip>
            ) : (
              <ContributorItem contributorIri={author} small />
            )}
          </Collapse>
        }
      >
        <Stack
          flex={1}
          borderRadius={3}
          bgcolor={color ? 'secondary.light' : 'white'}
          boxShadow={1}
          overflow="hidden"
          margin={1}
        >
          <ListItemButton
            dense
            disabled={isDisabled}
            onClick={() => dispatch(setSelectedAnnotation(!isSelected ? { entity, page, notes, assignments } : null))}
            selected={isSelected}
          >
            <Stack flex={1} spacing={0.5} alignItems="center">
              {isScoreSelected ? (
                <ListItemText
                  sx={{ paddingLeft: 1, textAlign: 'center' }}
                  primary="Score"
                  secondary={`with ${noteCount} items`}
                />
              ) : (
                <ListItemText
                  sx={{ paddingLeft: 1, textAlign: 'center' }}
                  primary={isSubEntity ? 'Sub-individual' : 'Individual'}
                  secondary={notes.length === 1 ? 'with one item' : `with ${notes.length} items`}
                />
              )}
              {assignments?.map(assignment => (
                <Assignment key={assignment.assignment} {...assignment} {...{ refetch, color }} />
              ))}
            </Stack>
          </ListItemButton>
        </Stack>
      </ListItem>
    )
}
