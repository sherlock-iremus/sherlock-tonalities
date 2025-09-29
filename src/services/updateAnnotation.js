import service from './service'
import { createAsyncThunk } from '@reduxjs/toolkit'
import sparql from './sparql'
import globals from './globals'
import { setAnnotation } from './setAnnotation'

export const updateAnnotation = createAsyncThunk(
  'globals/updateAnnotation',
  async (iri, { getState, dispatch, rejectWithValue }) => {
    try {
      const { projectIri, selectedNotes, scoreIri } = getState().globals
      const body = {
        p140: selectedNotes.map(note => scoreIri + '#' + note),
        p177: 'crm:P67_refers_to',
        p141: iri,
        p141_type: 'URI',
        document_context: scoreIri,
        analytical_project: projectIri,
        contribution_graph: 'tonalities-contributions',
      }
      await dispatch(service.endpoints.postAnnotation.initiate(body)).unwrap()
      await dispatch(sparql.endpoints.getFlatAnnotations.initiate(projectIri, { forceRefetch: true })).unwrap()
      await dispatch(sparql.endpoints.getAnnotations.initiate(projectIri, { forceRefetch: true })).unwrap()
      await dispatch(sparql.endpoints.getAssignments.initiate(iri, { forceRefetch: true })).unwrap()
      dispatch(globals.actions.setAnnotatedNotes(selectedNotes))
      dispatch(globals.actions.setSelectedNotes())
      dispatch(setAnnotation(iri))
    } catch (error) {
      console.error('Annotation update failed:', error)
      return rejectWithValue(error.message || 'Unexpected error')
    }
  }
)
