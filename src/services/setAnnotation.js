import sparql from './sparql'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setSelectedAnnotation } from './globals'

export const setAnnotation = createAsyncThunk('globals/setAnnotation', async (iri, { getState, dispatch }) => {
  const state = getState()
  const { projectIri } = state.globals
  
  const annotationsResult = await dispatch(sparql.endpoints.getAnnotations.initiate(projectIri))
  const annotations = annotationsResult.data || []
  const { annotation, entity, date, author, noteId } = annotations.find(annotation => annotation.entity === iri)
  
  const assignmentsResult = await dispatch(sparql.endpoints.getAssignments.initiate(iri))
  const assignments = assignmentsResult.data || []
  
  const notesResult = await dispatch(sparql.endpoints.getP140.initiate(annotation))
  const notes = notesResult.data || []
  
  const page = window.tk.getPageWithElement(noteId)

  const selectedAnnotation = { annotation, entity, date, author, noteId, notes, page, assignments }

  dispatch(setSelectedAnnotation(selectedAnnotation))
})
