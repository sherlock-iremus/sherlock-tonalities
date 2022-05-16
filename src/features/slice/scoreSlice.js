import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  scoreIri: 'http://data-iremus.huma-num.fr/id/eff6f0a7-cf80-402c-953b-c66161051356',
  meiUrl: 'http://data-iremus.huma-num.fr/files/modality-tonality/mei/eff6f0a7-cf80-402c-953b-c66161051356.mei',
  treatiseIri: '',
  isInspectionMode: true,
  inspectedEntities: [
    {
      clickedNoteIri: null,
      noteIri: null,
      verticalityIri: null,
      positionnedNoteIri: null,
      selectionIri: null,
      conceptIri: null,
      annotationIri: null,
    },
  ],
  currentEntityIndex: 0,
}

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setTreatise: (state, action) => {
      state.treatiseIri = action.payload
    },
    setToPreviousInspection: state => {
      state.currentEntityIndex = --state.currentEntityIndex
    },
    setToNextInspection: state => {
      state.currentEntityIndex = ++state.currentEntityIndex
    },
    setInspectedNote: (state, action) => {
      state.inspectedEntities.push(
        action.payload === state.inspectedEntities[state.currentEntityIndex].noteIri
          ? initialState.inspectedEntities[0]
          : { ...initialState.inspectedEntities[0], noteIri: action.payload, clickedNoteIri: action.payload }
      )
      state.currentEntityIndex = ++state.currentEntityIndex
    },
    setInspectedSelection: (state, action) => {
      state.currentEntityIndex = ++state.currentEntityIndex
      state.inspectedEntities.push(
        action.payload === state.inspectedEntities[state.currentEntityIndex]?.selectionIri
          ? initialState.inspectedEntities[0]
          : { ...initialState.inspectedEntities[0], selectionIri: action.payload }
      )
    },
    setInspectedConcept: (state, action) => {
      state.currentEntityIndex = ++state.currentEntityIndex
      state.inspectedEntities.push(
        action.payload === state.inspectedEntities[state.currentEntityIndex]?.conceptIri
          ? initialState.inspectedEntities[0]
          : { ...initialState.inspectedEntities[0], conceptIri: action.payload }
      )
    },
    setInspectedAnnotation: (state, action) => {
      state.currentEntityIndex = ++state.currentEntityIndex
      state.inspectedEntities.push(
        action.payload === state.inspectedEntities[state.currentEntityIndex]?.annotationIri
          ? initialState.inspectedEntities[0]
          : { ...initialState.inspectedEntities[0], annotationIri: action.payload }
      )
    },
  },
})

export const {
  setInspectedNote,
  setInspectedConcept,
  setInspectedAnnotation,
  setInspectedSelection,
  setToPreviousInspection,
  setToNextInspection,
  setTreatise
} = scoreSlice.actions

export default scoreSlice.reducer
