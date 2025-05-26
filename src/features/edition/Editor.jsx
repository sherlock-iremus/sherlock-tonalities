import { Lyrics, Send } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, Collapse, Button, IconButton } from '@mui/material'
import { Stack } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setAnnotatedNotes, setSelectedNotes } from '../../services/globals'
import { Input } from '../../components/Input'
import { useState } from 'react'
import { usePostAnnotationMutation } from '../../services/service'
import { useGetAnnotationsQuery, useGetAssignmentsQuery, useGetFlatAnnotationsQuery } from '../../services/sparql'
import { assignArbitraryText, assignSubEntity, createEntity, updateEntity } from '../../helper'
import { setAnnotation } from '../../services/setAnnotation'

export const Editor = () => {
  const { selectedNotes, isSubSelecting, isEditing, scoreIri, projectIri, selectedAnnotation, noteCount } = useSelector(
    state => state.globals
  )
  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery(projectIri)
  const { refetch: refetchFlatAnnotations } = useGetFlatAnnotationsQuery(projectIri)
  const { refetch: refetchAssignments } = useGetAssignmentsQuery(selectedAnnotation?.entity, {
    skip: !selectedAnnotation,
  })
  const [input, setInput] = useState('')
  const dispatch = useDispatch()

  const isScoreSelected = selectedNotes.includes(scoreIri) || false

  const updateAnnotation = async () => {
    try {
      await updateEntity({
        entityIri: selectedAnnotation.entity,
        selectedNotes,
        scoreIri,
        projectIri,
        postAnnotation,
      })
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(setSelectedNotes())
      dispatch(setAnnotatedNotes(selectedNotes))
      refetchAnnotations()
      refetchAssignments()
      refetchFlatAnnotations()
      dispatch(setAnnotation(selectedAnnotation.entity))
    }
  }

  const createAnnotation = async concept => {
    const entityIri = await createEntity({ selectedNotes, scoreIri, projectIri, postAnnotation })
    await assignArbitraryText({ entityIri, input, scoreIri, projectIri, postAnnotation })
    if (isSubSelecting) {
      await assignSubEntity({
        parentEntity: selectedAnnotation.entity,
        childEntity: entityIri,
        scoreIri,
        projectIri,
        postAnnotation,
      })
      refetchAssignments()
    }
    dispatch(setSelectedNotes())
    refetchAnnotations()
    refetchFlatAnnotations()
    setInput('')
  }

  return (
    <Collapse in={!!selectedNotes.length || isSubSelecting || isEditing} timeout="auto" unmountOnExit>
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
          {isScoreSelected && (
            <ListItemText primary={`Score with ${noteCount} items`} secondary="Select a concept to assign it" />
          )}
          {isEditing && (
            <ListItemText
              primary={`Individual with ${selectedNotes.length === 1 ? 'one item' : selectedNotes.length + ' items'}`}
              secondary="Updating current individual"
            />
          )}
          {isSubSelecting && (
            <ListItemText
              primary={`Sub-individual with ${
                selectedNotes.length === 1 ? 'one item' : selectedNotes.length + ' items'
              }`}
              secondary="Select a concept to assign it"
            />
          )}
          {!(isEditing || isSubSelecting) && (
            <ListItemText
              primary={`New individual with ${
                selectedNotes.length === 1 ? 'one item' : selectedNotes.length + ' items'
              }`}
              secondary="Select a concept to assign it"
            />
          )}
        </ListItem>
        {!isEditing ? (
          <Stack flex={1} direction="row" alignItems="center" paddingRight={1}>
            <Stack flex={1}>
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && createAnnotation()}
                placeholder="Comment..."
              />
            </Stack>
            <IconButton onClick={createAnnotation} disabled={isLoading}>
              <Send />
            </IconButton>
          </Stack>
        ) : (
          <Stack flex={1} justifyContent="end">
            <Button size="small" onClick={updateAnnotation} disabled={isLoading}>
              Update individual
            </Button>
          </Stack>
        )}
      </Stack>
    </Collapse>
  )
}
