import { createSlice } from '@reduxjs/toolkit'
import { ANNOTATION, CONCEPT, NOTE } from '../meiviewer/constants'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  scoreIri: 'http://data-iremus.huma-num.fr/id/eff6f0a7-cf80-402c-953b-c66161051356',
  meiUrl: 'http://data-iremus.huma-num.fr/files/modality-tonality/mei/eff6f0a7-cf80-402c-953b-c66161051356.mei',
  isInspectionMode: true,
  inspectedEntity: { id: null, type: null, clickedNoteId: null }
}

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setInspectedNote: (state, action) => {
      if (action.payload === state.inspectedEntity.id) {
        state.inspectedEntity.id = null
        state.inspectedEntity.type = null
        state.inspectedEntity.clickedNoteId = null
      }
      else {
        state.inspectedEntity.type = NOTE
        state.inspectedEntity.id = action.payload
        state.inspectedEntity.clickedNoteId = action.payload
      }
    },
    setInspectedConcept: (state, action) => {
      if (action.payload === state.inspectedEntity.id) {
        state.inspectedEntity.id = null
        state.inspectedEntity.type = null
        state.inspectedEntity.clickedNoteId = null
      }
      else {
        state.inspectedEntity.type = CONCEPT
        state.inspectedEntity.id = action.payload
        state.inspectedEntity.clickedNoteId = action.payload
      }
    },
    setInspectedAnnotation: (state, action) => {
      if (action.payload === state.inspectedEntity.id) {
        state.inspectedEntity.id = null
        state.inspectedEntity.type = null
        state.inspectedEntity.clickedNoteId = null
      }
      else {
        state.inspectedEntity.type = ANNOTATION
        state.inspectedEntity.id = action.payload
        state.inspectedEntity.clickedNoteId = action.payload
      }
    },
  },
})

export const { setInspectedNote, setInspectedConcept, setInspectedAnnotation } = scoreSlice.actions

export default scoreSlice.reducer
