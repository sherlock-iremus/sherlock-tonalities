import { AddCircle, ArrowBack, Cancel, Close, Downloading, Send } from '@mui/icons-material'
import { graph, sym, serialize } from 'rdflib'
import {
  AppBar,
  CircularProgress,
  Collapse,
  IconButton,
  ListItem,
  ListItemText,
  Slide,
  Stack,
  Toolbar,
  Tooltip,
} from '@mui/material'
import { useState } from 'react'
import { ContextMenu } from './navigator/ContextMenu'
import { Input } from '../components/Input'
import { useExportEntityQuery, useGetAssignmentsQuery } from '../services/sparql'
import { usePostAnnotationMutation } from '../services/service'
import { useDispatch, useSelector } from 'react-redux'
import { Assignment } from './items/Assignment'
import { setIsSubSelecting, setPreviousAnnotation, setSelectedAnnotation } from '../services/globals'

export const AnnotationPage = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const { selectedAnnotation, scoreIri, projectIri, selectedAnnotations } = useSelector(state => state.globals)
  const { data: assignments, refetch } = useGetAssignmentsQuery(selectedAnnotation?.entity, {
    skip: !selectedAnnotation,
  })
  const { data: exports } = useExportEntityQuery(selectedAnnotation?.entity, {
    skip: !isDownloading,
  })
  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const [input, setInput] = useState('')
  const [contextMenu, setContextMenu] = useState(false)
  const dispatch = useDispatch()

  const addComment = async () => {
    try {
      const body = {
        p140: selectedAnnotation.entity,
        p177: 'crm:P2_has_type',
        p141: input,
        p141_type: 'literal',
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

  const downloadFile = async () => {
    setIsDownloading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (exports)
      try {
        const store = graph()
        exports.forEach(({ subject, predicate, object }) => store.add(sym(subject), sym(predicate), sym(object)))
        const data = serialize(undefined, store, undefined, 'text/turtle')
        const blob = new Blob([data], { type: 'text/turtle' })
        const file = new File([blob], 'export.ttl', { type: 'text/turtle' })
        const downloadLink = document.createElement('a')
        downloadLink.href = URL.createObjectURL(file)
        downloadLink.download = 'export.ttl'
        downloadLink.click()
      } catch (e) {
        console.error(e)
      }
    setIsDownloading(false)
  }

  const handleInputChange = event => {
    setInput(event.target.value)
    const { top, left } = event.target.getBoundingClientRect()
    if (event.target.value.includes('@')) setContextMenu(!contextMenu ? { mouseX: left, mouseY: top + 24 } : null)
  }

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
                  selectedAnnotation?.notes.length === 1
                    ? 'Entity with one note'
                    : `Entity with ${selectedAnnotation?.notes.length} notes`
                }
              ></ListItemText>
            </ListItem>
            <Tooltip title="Download Turtle file">
              <IconButton color="inherit" onClick={downloadFile}>
                {isDownloading ? <CircularProgress color="inherit" size={20} /> : <Downloading />}
              </IconButton>
            </Tooltip>
            <Tooltip title="New layer">
              <IconButton color="inherit" onClick={() => dispatch(setIsSubSelecting())}>
                <AddCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete entity">
              <IconButton edge="end" color="inherit">
                <Cancel />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Stack flex={1} overflow="auto" padding={1} spacing={1} paddingTop={2}>
          {assignments?.map(assignment => (
            <Assignment key={assignment.assignment} {...assignment} refetch={refetch} onPage />
          ))}
        </Stack>
        <Stack direction="row" paddingRight={1} justifySelf="flex-end" alignItems="center">
          <Stack flex={1}>
            <Input value={input} onChange={handleInputChange} placeholder="Comment..." />
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
