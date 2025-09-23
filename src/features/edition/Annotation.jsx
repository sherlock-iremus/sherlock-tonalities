/* eslint-disable react-hooks/exhaustive-deps */
import { Cancel, DragHandle, ExpandLess, ExpandMore } from '@mui/icons-material'
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
import {
  useGetAnalyticalProjectQuery,
  useGetAnnotationsQuery,
  useGetAssignmentsQuery,
  useGetFlatAnnotationsQuery,
  useGetP140Query,
} from '../../services/sparql'
import { useDeleteAnnotationMutation, useGetUserIdQuery } from '../../services/service'
import { useEffect, useState } from 'react'
import { Assignment } from '../items/Assignment'
import { ContributorItem } from '../items/ContributorItem'
import { setAnnotation } from '../../services/setAnnotation'
import { useDraggable } from '@dnd-kit/core'

export const Annotation = ({
  annotation,
  entity,
  date,
  page,
  author,
  isSubEntity,
  color,
  onDelete,
  expandAll,
  onPage,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [expand, setExpand] = useState(true)
  const { data: notes } = useGetP140Query(annotation, { skip: !annotation })
  const { data: assignments, refetch } = useGetAssignmentsQuery(entity, { skip: !entity })
  const dispatch = useDispatch()
  const { selectedAnnotation, scoreIri, projectIri, filteredAnnotations } = useSelector(state => state.globals)

  const { data: project } = useGetAnalyticalProjectQuery(projectIri)
  const { isPublished } = project || {}

  const isScoreSelected = notes?.includes(scoreIri) || false
  const isSelected = selectedAnnotation?.entity === entity || false

  const { data: userId } = useGetUserIdQuery()
  const canDelete = userId === getUuid(author)

  const isDisabled = filteredAnnotations.length && !filteredAnnotations.includes(entity)

  useEffect(() => {
    if (notes) dispatch(setAnnotatedNotes(notes))
    return () => notes && dispatch(unsetAnnotatedNotes(notes))
  }, [notes])

  useEffect(() => setExpand(expandAll) && undefined, [expandAll])
  const { attributes, listeners, setNodeRef } = useDraggable({ id: annotation })

  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()
  const { refetch: refetchFlatAnnotations } = useGetFlatAnnotationsQuery(projectIri)
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
      refetchFlatAnnotations()
      dispatch(setSelectedAnnotation())
      dispatch(setHoveredAnnotation())
    } catch (error) {
      console.error(error)
    }
  }

  if (notes)
    return (
      <ListItem
        ref={setNodeRef}
        component="div"
        key={date}
        onMouseEnter={() => dispatch(setHoveredAnnotation({ entity, page, notes, assignments }))}
        onMouseLeave={() => dispatch(setHoveredAnnotation())}
        disablePadding
        sx={{ '& .MuiListItemSecondaryAction-root': { top: 30 } }}
        secondaryAction={
          !isDisabled && (
            <Stack direction="row" alignItems="center">
              {!isSubEntity && (
                <IconButton size="small" onClick={() => setExpand(!expand)}>
                  {expand ? <ExpandMore /> : <ExpandLess />}
                </IconButton>
              )}
              {canDelete && !isPublished && (!isSubEntity || onPage) && (
                <Tooltip title="Delete entity">
                  <IconButton
                    onClick={() => (assignments?.length ? setIsDeleteDialogOpen(true) : removeAnnotation())}
                    size="small"
                  >
                    <Cancel />
                  </IconButton>
                </Tooltip>
              )}
              {!canDelete && <ContributorItem contributorIri={author} small />}
              {!isPublished && (
                <IconButton size="small" {...listeners} {...attributes}>
                  <DragHandle />
                </IconButton>
              )}
            </Stack>
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
            disabled={isLoading}
            onClick={() => dispatch(setAnnotation(entity))}
            selected={isSelected}
          >
            <Stack flex={1} alignItems="center">
              {isScoreSelected ? (
                <ListItemText
                  sx={{ paddingLeft: 1, textAlign: 'center' }}
                  primary="Score"
                  secondary={new Date(date).toLocaleString('en-GB').slice(0, -3)}
                />
              ) : (
                !isDisabled && (
                  <ListItemText
                    sx={{ paddingLeft: 1, textAlign: 'center' }}
                    primary={isSubEntity ? 'Sub-individual' : 'Individual'}
                    secondary={new Date(date).toLocaleString('en-GB').slice(0, -3)}
                  />
                )
              )}
              <Collapse in={expand} timeout="auto" unmountOnExit>
                <Stack gap={0.5}>
                  {assignments?.map(assignment => (
                    <Assignment
                      key={assignment.assignment}
                      {...assignment}
                      {...{ refetch, color, expandAll, isDisabled }}
                    />
                  ))}
                </Stack>
              </Collapse>
            </Stack>
          </ListItemButton>
        </Stack>
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}
        >
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
