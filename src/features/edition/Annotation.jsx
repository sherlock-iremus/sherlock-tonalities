/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel } from '@mui/icons-material'
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAnnotatedNotes,
  setHoveredAnnotation,
  setSelectedAnnotation,
  unsetAnnotatedNotes,
} from '../../services/globals'
import { getUuid } from '../../utils'
import { useGetAnnotationsQuery, useGetAssignmentsQuery, useGetP140Query } from '../../services/sparql'
import { useDeleteAnnotationMutation, useGetUserIdQuery } from '../../services/service'
import { useEffect, useState } from 'react'
import { getId } from '../../utils'
import { Assignment } from '../items/Assignment'
import { ContributorItem } from '../items/ContributorItem'

export const Annotation = ({ annotation, entity, date, page, author, isSubEntity, color, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { data: notes } = useGetP140Query(annotation, { skip: !annotation })
  const { data: assignments, refetch } = useGetAssignmentsQuery(entity, { skip: !entity })
  const dispatch = useDispatch()
  const { hoveredAnnotation, selectedAnnotation, scoreIri, projectIri, selectedNotes, selectedConcepts, noteCount } =
    useSelector(state => state.globals)

  const isScoreSelected = notes?.includes(scoreIri) || false
  const isSelected = selectedAnnotation?.entity === entity || false
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

  useEffect(() => {
    if (notes) dispatch(setAnnotatedNotes(notes))
    return () => notes && dispatch(unsetAnnotatedNotes(notes))
  }, [notes])

  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery(projectIri)

  const removeAnnotation = async () => {
    if (assignments?.length) {
      try {
        if (isSubEntity) await onDelete()
        await Promise.all(assignments.map(({ assignment }) => deleteAnnotation(getUuid(assignment)).unwrap()))
        refetch()
      } catch (error) {
        console.error(error)
      }
    }
    try {
      await deleteAnnotation(getUuid(annotation)).unwrap()
      refetchAnnotations()
      dispatch(setSelectedAnnotation())
      dispatch(setHoveredAnnotation())
    } catch (error) {
      console.error(error)
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
          canDelete ? (
            <Tooltip title="Delete entity">
              <IconButton
                onClick={() => (assignments?.length ? setIsDeleteDialogOpen(true) : removeAnnotation())}
                size="small"
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          ) : (
            <ContributorItem contributorIri={author} small />
          )
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
            onClick={() =>
              dispatch(setSelectedAnnotation(!isSelected ? { entity, annotation, page, notes, assignments } : null))
            }
            selected={isSelected}
          >
            <Stack flex={1} spacing={0.5} alignItems="center">
              {isScoreSelected ? (
                <ListItemText
                  sx={{ paddingLeft: 1, textAlign: 'center' }}
                  primary="Score"
                  secondary={new Date(date).toLocaleString('en-GB').slice(0, -3)}
                />
              ) : (
                <ListItemText
                  sx={{ paddingLeft: 1, textAlign: 'center' }}
                  primary={isSubEntity ? 'Sub-individual' : 'Individual'}
                  secondary={new Date(date).toLocaleString('en-GB').slice(0, -3)}
                />
              )}
              {assignments?.map(assignment => (
                <Assignment key={assignment.assignment} {...assignment} {...{ refetch, color }} />
              ))}
            </Stack>
          </ListItemButton>
        </Stack>
        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle>
            Delete individual with
            {assignments?.length > 1
              ? ` ${assignments.length} corresponding assignments`
              : ' 1 corresponding assignment ?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>This action cannot be undone</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)} size="small">
              Cancel
            </Button>
            <Button onClick={removeAnnotation} autoFocus color="error" size="small">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ListItem>
    )
}
