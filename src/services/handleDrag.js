import { createAsyncThunk } from '@reduxjs/toolkit'
import { getUuid } from '../utils'
import service from './service'
import sparql from './sparql'

export const handleDrag = createAsyncThunk(
  'globals/handleDrag',
  async ({ draggedIri, droppedOnIri }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (draggedIri === droppedOnIri) throw new Error('Same annotation')

      const projectIri = getState().globals.projectIri
      const getFlatAnnotationsResult = await dispatch(sparql.endpoints.getFlatAnnotations.initiate(projectIri)).unwrap()
      const flatAnnotations = getFlatAnnotationsResult
      const droppedOnEntity = flatAnnotations.find(a => a.annotation === droppedOnIri)?.entity
      const draggedEntity = flatAnnotations.find(a => a.annotation === draggedIri)?.entity

      const incomingAnnotationResult = await dispatch(
        sparql.endpoints.getIncomingAnnotation.initiate(draggedIri, { forceRefetch: true })
      ).unwrap()
      const { incomingAnnotation, incomingEntity } = incomingAnnotationResult

      if (incomingAnnotation) {
        if (incomingEntity === droppedOnEntity) throw new Error('Already linked')
        await dispatch(
          service.endpoints.deleteAnnotation.initiate(getUuid(incomingAnnotation))
        ).unwrap()

        await dispatch(sparql.endpoints.getAssignments.initiate(incomingEntity, { forceRefetch: true })).unwrap()
      }
      if (droppedOnEntity) {
        const body = {
          p140: [droppedOnEntity],
          p177: 'crm:P106_is_composed_of',
          p141: draggedEntity,
          p141_type: 'URI',
          document_context: getState().globals.scoreIri,
          analytical_project: projectIri,
          contribution_graph: 'tonalities-contributions',
        }
        await dispatch(service.endpoints.postAnnotation.initiate(body)).unwrap()
      }
      await dispatch(sparql.endpoints.getFlatAnnotations.initiate(projectIri, { forceRefetch: true })).unwrap()
      await dispatch(sparql.endpoints.getAnnotations.initiate(projectIri, { forceRefetch: true })).unwrap()
      await dispatch(sparql.endpoints.getAssignments.initiate(droppedOnEntity, { forceRefetch: true })).unwrap()
    } catch (err) {
      console.error('handleDrag failed:', err)
      return rejectWithValue(err.message || 'Unexpected error')
    }
  }
)
