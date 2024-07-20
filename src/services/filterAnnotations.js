import sparql from './sparql'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setFilteredAnnotations } from './globals'

export const filterAnnotations = createAsyncThunk('globals/filterAnnotations', async (_, { getState, dispatch }) => {
  const state = getState()
  const { selectedConcepts, selectedNotes, projectIri } = state.globals

  const annotationsResult = await dispatch(sparql.endpoints.getFlatAnnotations.initiate(projectIri))
  const annotations = annotationsResult.data || []

  const filterAnnotations = annotation =>
    selectedNotes.some(note => annotation.notes.includes(note)) ||
    selectedConcepts.some(concept => annotation.concepts.includes(concept))

  const filteredAnnotations = annotations.filter(filterAnnotations).map(({ entity }) => entity)
  dispatch(setFilteredAnnotations(filteredAnnotations))
})
