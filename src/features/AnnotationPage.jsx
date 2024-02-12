import { AddCircle, ArrowBack, Close, KeyboardControlKey, Send } from '@mui/icons-material'
import {
  AppBar,
  Button,
  Collapse,
  IconButton,
  ListItem,
  ListItemText,
  Slide,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { ContextMenu } from './navigator/ContextMenu'
import { Input } from '../components/Input'
import { useGetAnnotationsQuery, useGetAssignmentsQuery } from '../services/sparql'
import { useDeleteAnnotationMutation, usePostAnnotationMutation } from '../services/service'
import { useDispatch, useSelector } from 'react-redux'
import { Assignment } from './items/Assignment'
import { setIsSubSelecting, setPreviousAnnotation, setSelectedAnnotation } from '../services/globals'
import { getUuid } from '../utils'

export const AnnotationPage = () => {
  const { selectedAnnotation, scoreIri, projectIri, selectedAnnotations, noteCount } = useSelector(
    state => state.globals
  )
  const { data: assignments, refetch } = useGetAssignmentsQuery(selectedAnnotation?.entity, {
    skip: !selectedAnnotation,
  })
  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const [input, setInput] = useState('')
  const [contextMenu, setContextMenu] = useState(false)
  const dispatch = useDispatch()
  const isScoreSelected = selectedAnnotation?.notes.includes(scoreIri) || false
  const [deleteAnnotation] = useDeleteAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery(projectIri)
  const [isCommandKeyPressed, setIsCommandKeyPressed] = useState(false)

  const addComment = async () => {
    try {
      const body = {
        p140: [selectedAnnotation.entity],
        p177: 'crm:P2_has_type',
        p141: input,
        p141_type: 'LITERAL',
        document_context: scoreIri,
        analytical_project: projectIri,
      }
      await postAnnotation(body).unwrap()
      setInput('')
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  const removeAnnotation = async () => {
    try {
      await deleteAnnotation(getUuid(selectedAnnotation.annotation)).unwrap()
      dispatch(setSelectedAnnotation())
      refetchAnnotations()
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = event => {
    setInput(event.target.value)
    const { top, left } = event.target.getBoundingClientRect()
    if (event.target.value.includes('@')) setContextMenu(!contextMenu ? { mouseX: left, mouseY: top + 24 } : null)
  }

  const handleKeyDown = useCallback(event => {
    if (event.ctrlKey && event.key === 'n') {
      dispatch(setIsSubSelecting())
      event.preventDefault()
    }
  }, [])
  const handleKeyUp = useCallback(event => event.key === 'Control' && setIsCommandKeyPressed(false), [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  return (
    <Slide direction="up" in={!!selectedAnnotation} mountOnEnter unmountOnExit>
      <Stack flex={1} minHeight={0}>
        <AppBar sx={{ position: 'relative', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <Toolbar>
            <Collapse in={selectedAnnotations.length > 1} timeout="auto" unmountOnExit>
              <IconButton edge="start" color="inherit" onClick={() => dispatch(setPreviousAnnotation())}>
                <ArrowBack />
              </IconButton>
            </Collapse>
            <IconButton edge="start" color="inherit" onClick={() => dispatch(setSelectedAnnotation())}>
              <Close />
            </IconButton>
            <ListItem dense>
              <ListItemText
                primary={
                  isScoreSelected
                    ? `Score with ${noteCount} items`
                    : selectedAnnotation?.notes.length === 1
                    ? 'Individual with one item'
                    : `Individual with ${selectedAnnotation?.notes.length} items`
                }
              />
            </ListItem>
            <Tooltip
              title={
                <Stack flex={1} direction="row" alignItems="center">
                  Add sub-layer (<KeyboardControlKey sx={{ width: 16, height: 16 }} />
                  +N)
                </Stack>
              }
            >
              <IconButton edge="end" color="inherit" onClick={() => dispatch(setIsSubSelecting())}>
                <AddCircle />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Stack flex={1} overflow="auto" padding={1} spacing={1} paddingTop={2}>
          {assignments?.length ? (
            assignments.map(assignment => (
              <Assignment key={assignment.assignment} {...assignment} refetch={refetch} onPage />
            ))
          ) : (
            <Stack flex={1} justifyContent="center">
              <Typography textAlign="center" color="text.secondary" fontSize={14}>
                No assignments found for this individual
              </Typography>
              <Button size="small" onClick={removeAnnotation}>
                Remove individual
              </Button>
            </Stack>
          )}
        </Stack>
        <Stack direction="row" paddingRight={1} justifySelf="flex-end" alignItems="center">
          <Stack flex={1}>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Comment..."
              onKeyPress={e => e.key === 'Enter' && addComment()}
            />
          </Stack>
          <IconButton onClick={addComment} disabled={!!isLoading}>
            <Send />
          </IconButton>
          <ContextMenu {...{ contextMenu, setContextMenu }} />
        </Stack>
      </Stack>
    </Slide>
  )
}
