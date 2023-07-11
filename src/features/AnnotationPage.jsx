import { Close, Delete, Send } from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { ContextMenu } from './navigator/ContextMenu'
import { Input } from '../components/Input'
import { useGetAssignmentsQuery, useGetP140Query } from '../services/sparql'
import { usePostAnnotationMutation } from '../services/service'
import { useSelector } from 'react-redux'
import { Assignment } from './items/Assignment'

export const AnnotationPage = ({ annotation, entity, onClose }) => {
  const { data: notes } = useGetP140Query(annotation, { skip: !annotation })
  const { data: assignments, refetch } = useGetAssignmentsQuery(entity, { skip: !entity })
  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const [input, setInput] = useState('')
  const [contextMenu, setContextMenu] = useState(false)
  const { scoreIri, projectIri } = useSelector(state => state.globals)

  const addComment = async () => {
    try {
      const body = {
        p140: entity,
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

  if (notes)
    return (
      <Slide direction="up" in={!!annotation} mountOnEnter unmountOnExit>
        <Stack overflow="auto">
          <AppBar sx={{ position: 'relative', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={onClose}>
                <Close />
              </IconButton>
              <ListItem dense>
                <ListItemText
                  primary={
                    notes.length === 1
                      ? 'Analytical entity with one note'
                      : `Analytical entity with ${notes.length} notes`
                  }
                ></ListItemText>
              </ListItem>
              <IconButton edge="end" color="inherit">
                <Delete />
              </IconButton>
            </Toolbar>
          </AppBar>
          <ListSubheader disableSticky>Comments</ListSubheader>
            {assignments?.map(assignment => (
              <Assignment key={assignment.assignment} {...assignment} refetch={refetch} />
            ))}
          <Stack flex={1} borderRadius={3} bgcolor="white" boxShadow={1} overflow="hidden" margin={1}>
            <ListItemButton dense>
              <ListItemIcon>
                <Stack>
                  <Avatar sx={{ height: 32, width: 32 }} />
                </Stack>
              </ListItemIcon>
              <ListItemText secondary="02/03/2023">
                <Typography textAlign="justify" component="span" color="text.secondary" overflow="scroll" fontSize={14}>
                  Lorem ipsum
                </Typography>
              </ListItemText>
            </ListItemButton>
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
  else return null
}
