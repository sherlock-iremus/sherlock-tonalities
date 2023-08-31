import { Lyrics, Send } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, Collapse, Button, IconButton } from '@mui/material'
import { Stack } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedNotes } from '../../services/globals'
import { Input } from '../../components/Input'
import { useState } from 'react'
import { usePostAnnotationMutation } from '../../services/service'
import { useGetAnnotationsQuery, useGetAssignmentsQuery } from '../../services/sparql'
import { assignArbitraryText, assignSubEntity, createEntity } from '../../helper'

export const Editor = () => {
  const { selectedNotes, isSubSelecting, scoreIri, projectIri, selectedAnnotation } = useSelector(
    state => state.globals
  )
  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery({ scoreIri, projectIri })
  const { refetch: refetchAssignments } = useGetAssignmentsQuery(selectedAnnotation?.entity, {
    skip: !selectedAnnotation,
  })
  const [input, setInput] = useState('')
  const dispatch = useDispatch()

  const createAnnotation = async concept => {
    const entityIri = await createEntity({ selectedNotes, scoreIri, projectIri, postAnnotation })
    await assignArbitraryText({ entityIri, input, scoreIri, projectIri, postAnnotation })
    if (isSubSelecting) {
      await assignSubEntity({
        parentEntity: selectedAnnotation.entity,
        childEntity: entityIri,
        predicate: 'guillotel:has_line',
        scoreIri,
        projectIri,
        postAnnotation,
      })
      refetchAssignments()
    }
    dispatch(setSelectedNotes())
    refetchAnnotations()
    setInput('')
  }

  return (
    <Collapse in={!!selectedNotes.length || isSubSelecting} timeout="auto" unmountOnExit>
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
              ${isSubSelecting ? 'Sub' : 'New '} entity with ${
              selectedNotes.length === 1 ? 'one note' : selectedNotes.length + ' notes'
            }`}
            secondary="Select a concept to assign it"
          />
        </ListItem>
        <Stack flex={1} direction="row" alignItems="center" paddingRight={1}>
          <Stack flex={1}>
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Comment..." />
          </Stack>
          <IconButton onClick={createAnnotation} disabled={isLoading}>
            <Send />
          </IconButton>
        </Stack>
      </Stack>
    </Collapse>
  )
}
