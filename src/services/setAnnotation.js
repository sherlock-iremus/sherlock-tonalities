import sparql from './sparql'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setSelectedAnnotation } from './globals'
import { getUuid } from '../utils'

export const setAnnotation = createAsyncThunk('globals/setAnnotation', async (iri, { getState, dispatch }) => {
  if (!iri) return dispatch(setSelectedAnnotation())
  const state = getState()
  const { projectIri } = state.globals

  const annotationsResult = await dispatch(sparql.endpoints.getFlatAnnotations.initiate(projectIri))
  const annotations = annotationsResult.data || []
  const { entity, annotation, date, author } = annotations.find(annotation => annotation.entity === iri)

  const assignmentsResult = await dispatch(sparql.endpoints.getAssignments.initiate(iri))
  const assignments = assignmentsResult.data || []
  const notesResult = await dispatch(sparql.endpoints.getP140.initiate(annotation))
  const notes = notesResult.data || []
  
  const page = window.tk.getPageWithElement(getUuid(notes[0]))

  const selectedAnnotation = { entity, annotation, date, author, notes, page, assignments }

  dispatch(setSelectedAnnotation(selectedAnnotation))
})
