import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  scoreIri: 'http://data-iremus.huma-num.fr/id/eff6f0a7-cf80-402c-953b-c66161051356',
  meiUrl: 'http://data-iremus.huma-num.fr/files/modality-tonality/mei/eff6f0a7-cf80-402c-953b-c66161051356.mei',
  treatiseIri: '',
  isInspectionMode: true,
  isSelectionMode: false,
  inspectedEntities: [{}],
  currentEntityIndex: 0,
  selectedEntities: [],
  focusEntityIndex: -1,
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
    setSelectionMode: state => {
      state.isInspectionMode = false
      state.isSelectionMode = true
    },
    setInspectionMode: state => {
      state.isInspectionMode = true
      state.isSelectionMode = false
    },
    setSelectedNote: (state, action) => {
      const index = state.selectedEntities.findIndex(e => e.noteIri === action.payload)
      index !== -1 ? state.selectedEntities.splice(index, 1) : state.selectedEntities.push({ noteIri: action.payload })
    },
    setSelectedSelection: (state, action) => {
      const index = state.selectedEntities.findIndex(e => e.selectionIri === action.payload)
      index !== -1
        ? state.selectedEntities.splice(index, 1)
        : state.selectedEntities.push({ selectionIri: action.payload })
    },
    setInspectedNote: (state, action) => {
      if (state.inspectedEntities.length > state.currentEntityIndex + 1)
        state.inspectedEntities.splice(
          state.currentEntityIndex + 1,
          state.inspectedEntities.length - state.currentEntityIndex
        )
      state.inspectedEntities.push(
        action.payload === state.inspectedEntities[state.currentEntityIndex].noteIri
          ? {}
          : { noteIri: action.payload, clickedNoteIri: action.payload }
      )
      state.currentEntityIndex = ++state.currentEntityIndex
    },
    setInspectedVerticality: (state, action) => {
      if (state.inspectedEntities.length > state.currentEntityIndex + 1)
        state.inspectedEntities.splice(
          state.currentEntityIndex + 1,
          state.inspectedEntities.length - state.currentEntityIndex
        )
      state.inspectedEntities.push(
        action.payload.verticalityIri === state.inspectedEntities[state.currentEntityIndex].verticalityIri
          ? {}
          : {
              verticalityIri: action.payload.verticalityIri,
              clickedNoteIri: action.payload.rightClickedNoteIri,
            }
      )
      state.currentEntityIndex = ++state.currentEntityIndex
    },
    setInspectedPositionnedNote: (state, action) => {
      if (state.inspectedEntities.length > state.currentEntityIndex + 1)
        state.inspectedEntities.splice(
          state.currentEntityIndex + 1,
          state.inspectedEntities.length - state.currentEntityIndex
        )
      state.inspectedEntities.push(
        action.payload.positionnedNoteIri === state.inspectedEntities[state.currentEntityIndex].positionnedNoteIri
          ? {}
          : {
              positionnedNoteIri: action.payload.positionnedNoteIri,
              attachedNoteIri: action.payload.attachedNoteIri,
              clickedNoteIri: state.inspectedEntities[state.currentEntityIndex].clickedNoteIri,
            }
      )
      state.currentEntityIndex = ++state.currentEntityIndex
    },
    setInspectedSelection: (state, action) => {
      if (state.inspectedEntities.length > state.currentEntityIndex + 1)
        state.inspectedEntities.splice(
          state.currentEntityIndex + 1,
          state.inspectedEntities.length - state.currentEntityIndex
        )
      state.inspectedEntities.push(
        action.payload === state.inspectedEntities[state.currentEntityIndex].selectionIri
          ? {}
          : { selectionIri: action.payload }
      )
      state.currentEntityIndex = ++state.currentEntityIndex
    },
    setInspectedConcept: (state, action) => {
      if (state.inspectedEntities.length > state.currentEntityIndex + 1)
        state.inspectedEntities.splice(
          state.currentEntityIndex + 1,
          state.inspectedEntities.length - state.currentEntityIndex
        )
      state.inspectedEntities.push(
        action.payload === state.inspectedEntities[state.currentEntityIndex].conceptIri
          ? {}
          : { conceptIri: action.payload }
      )
      state.currentEntityIndex = ++state.currentEntityIndex
    },
    setInspectedAnnotation: (state, action) => {
      if (state.inspectedEntities.length > state.currentEntityIndex + 1)
        state.inspectedEntities.splice(
          state.currentEntityIndex + 1,
          state.inspectedEntities.length - state.currentEntityIndex
        )
      state.inspectedEntities.push(
        action.payload === state.inspectedEntities[state.currentEntityIndex].annotationIri
          ? {}
          : { annotationIri: action.payload }
      )
      state.currentEntityIndex = ++state.currentEntityIndex
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
  setTreatise,
  setInspectedVerticality,
  setSelectedNote,
  setSelectedSelection,
  setInspectionMode,
  setSelectionMode,
  setInspectedPositionnedNote,
} = scoreSlice.actions

export default scoreSlice.reducer
