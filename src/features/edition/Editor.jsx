import { Lyrics, Send } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, Collapse, Button, IconButton, CircularProgress } from '@mui/material'
import { Stack } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedNotes } from '../../services/globals'
import { Input } from '../../components/Input'
import { useState } from 'react'
import { usePostAnnotationMutation } from '../../services/service'
import { useGetAnnotationsQuery } from '../../services/sparql'
import { createEntity } from '../../helper'

export const Editor = () => {
  const { selectedNotes, scoreIri, projectIri } = useSelector(state => state.globals)
  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery({ scoreIri, projectIri })
  const [input, setInput] = useState('')
  const dispatch = useDispatch()

  const createAnnotation = async concept => {
    const entityIri = await createEntity({ selectedNotes, scoreIri, projectIri, postAnnotation })
    try {
      const body = {
        p140: entityIri,
        p177: 'crm:P2_has_type',
        p141: input,
        p141_type: 'literal',
        document_context: scoreIri,
        analytical_project: projectIri,
      }
      await postAnnotation(body).unwrap()
      dispatch(setSelectedNotes())
      refetchAnnotations()
      setInput('')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Collapse in={!!selectedNotes.length} timeout="auto" unmountOnExit>
      <Stack borderRadius={3} bgcolor="white" boxShadow={1}>
        <ListItem
          dense
          secondaryAction={
            <Button size="small" onClick={() => dispatch(setSelectedNotes())}>
              Cancel
            </Button>
          }
        >
          <ListItemIcon>
            <Lyrics />
          </ListItemIcon>
          <ListItemText
            primary={`
              New entity with ${selectedNotes.length === 1 ? 'one note' : selectedNotes.length + ' notes'}`}
            secondary="Select a concept to assign it"
          />
        </ListItem>
        <Stack flex={1} direction="row" alignItems="center" paddingRight={1}>
          <Stack flex={1}>
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Comment..." />
          </Stack>
          <IconButton onClick={createAnnotation}>{isLoading ? <CircularProgress /> : <Send />}</IconButton>
        </Stack>
      </Stack>
    </Collapse>
  )
}
