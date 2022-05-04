import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  scoreIri: 'http://data-iremus.huma-num.fr/id/eff6f0a7-cf80-402c-953b-c66161051356',
  meiUrl: 'http://data-iremus.huma-num.fr/files/modality-tonality/mei/eff6f0a7-cf80-402c-953b-c66161051356.mei',
  isInspectionMode: true,
  inspectedEntity: {
    clickedNoteIri: null,
    noteIri: null,
    verticalityIri: null,
    positionnedNoteIri: null,
    selectionIri: null,
    conceptIri: null,
    annotationIri: null,
  },
}

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setInspectedNote: (state, action) => {
      state.inspectedEntity =
        action.payload === state.inspectedEntity.noteIri
          ? initialState.inspectedEntity
          : { ...initialState.inspectedEntity, noteIri: action.payload, clickedNoteIri: action.payload }
    },
    setInspectedConcept: (state, action) => {
      state.inspectedEntity =
        action.payload === state.inspectedEntity.conceptIri
          ? initialState.inspectedEntity
          : { ...initialState.inspectedEntity, conceptIri: action.payload }
    },
    setInspectedAnnotation: (state, action) => {
      state.inspectedEntity =
        action.payload === state.inspectedEntity.annotationIri
          ? initialState.inspectedEntity
          : { ...initialState.inspectedEntity, annotationIri: action.payload }
    },
  },
})

export const { setInspectedNote, setInspectedConcept, setInspectedAnnotation } = scoreSlice.actions

export default scoreSlice.reducer
