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
    setSelectedEntity: (state, action) => {
      const index =
        (action.payload.noteIri && state.selectedEntities.findIndex(e => e.noteIri === action.payload.noteIri)) ||
        (action.payload.verticalityIri &&
          state.selectedEntities.findIndex(e => e.verticalityIri === action.payload.verticalityIri)) ||
        (action.payload.positionnedNoteIri &&
          state.selectedEntities.findIndex(e => e.positionnedNoteIri === action.payload.positionnedNoteIri)) ||
        (action.payload.selectionIri &&
          state.selectedEntities.findIndex(e => e.selectionIri === action.payload.selectionIri))
      index !== -1 ? state.selectedEntities.splice(index, 1) : state.selectedEntities.push(action.payload)
    },
    setInspectedEntity: (state, action) => {
      if (state.inspectedEntities.length > state.currentEntityIndex + 1)
        state.inspectedEntities.splice(
          state.currentEntityIndex + 1,
          state.inspectedEntities.length - state.currentEntityIndex
        )
      const { noteIri, verticalityIri, positionnedNoteIri, selectionIri, conceptIri, annotationIri } =
        state.inspectedEntities[state.currentEntityIndex]
      const currentEntityIri =
        noteIri || verticalityIri || positionnedNoteIri || selectionIri || conceptIri || annotationIri
      const {
        noteIri: newNoteIri,
        verticalityIri: newVerticalityIri,
        positionnedNoteIri: newPositionnedNoteIri,
        selectionIri: newSelectionIri,
        conceptIri: newConceptIri,
        annotationIri: newAnnotationIri,
      } = action.payload
      const newEntityIri =
        newNoteIri || newVerticalityIri || newPositionnedNoteIri || newSelectionIri || newConceptIri || newAnnotationIri
      state.inspectedEntities.push(currentEntityIri === newEntityIri ? {} : action.payload)
      state.currentEntityIndex = ++state.currentEntityIndex
    },
  },
})

export const {
  setInspectedEntity,
  setToPreviousInspection,
  setToNextInspection,
  setTreatise,
  setSelectedEntity,
  setInspectionMode,
  setSelectionMode,
} = scoreSlice.actions

export default scoreSlice.reducer
