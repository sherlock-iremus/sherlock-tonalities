import { Close, Delete, Send } from '@mui/icons-material'
import { AppBar, CircularProgress, IconButton, ListItem, ListItemText, Slide, Stack, Toolbar } from '@mui/material'
import { useState } from 'react'
import { ContextMenu } from './navigator/ContextMenu'
import { Input } from '../components/Input'
import { useGetAssignmentsQuery } from '../services/sparql'
import { usePostAnnotationMutation } from '../services/service'
import { useDispatch, useSelector } from 'react-redux'
import { Assignment } from './items/Assignment'
import { setSelectedAnnotation } from '../services/globals'

export const AnnotationPage = ({ isOpen }) => {
  const { selectedAnnotation, scoreIri, projectIri } = useSelector(state => state.globals)
  const { data: assignments, refetch } = useGetAssignmentsQuery(selectedAnnotation?.entity, {
    skip: !selectedAnnotation,
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
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = event => {
    setInput(event.target.value)
    const { top, left } = event.target.getBoundingClientRect()
    if (event.target.value.includes('@')) setContextMenu(!contextMenu ? { mouseX: left, mouseY: top + 24 } : null)
  }

  return (
    <Slide direction="up" in={!!selectedAnnotation} mountOnEnter unmountOnExit>
      <Stack overflow="auto">
        <AppBar sx={{ position: 'relative', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => dispatch(setSelectedAnnotation())}>
              <Close />
            </IconButton>
            <ListItem dense>
              <ListItemText
                primary={
                  selectedAnnotation?.notes.length === 1
                    ? 'Analytical entity with one note'
                    : `Analytical entity with ${selectedAnnotation?.notes.length} notes`
                }
              ></ListItemText>
            </ListItem>
            <IconButton edge="end" color="inherit">
              <Delete />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Stack padding={1}>
          {assignments?.map(assignment => (
            <Assignment key={assignment.assignment} {...assignment} refetch={refetch} />
          ))}
        </Stack>
        <Stack flex={1} direction="row" alignItems="center" paddingRight={1}>
          <Stack flex={1}>
            <Input value={input} onChange={handleInputChange} placeholder="Comment..." />
          </Stack>
          <IconButton onClick={addComment}>{isLoading ? <CircularProgress /> : <Send />}</IconButton>
          <ContextMenu {...{ contextMenu, setContextMenu }} />
        </Stack>
      </Stack>
    </Slide>
  )
}
