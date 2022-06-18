import { createSlice } from '@reduxjs/toolkit'
import { findKey } from '../../features/score/utils'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  scoreIri: '',
  scoreTitle: '',
  meiUrl: '',
  treatiseIri: '',
  isInspectionMode: true,
  isSelectionMode: false,
  inspectedEntities: [{}],
  currentEntityIndex: 0,
  selectedEntities: [],
  focusEntityIndex: -1,
  hoveredEntity: {},
  annotationEditor: { subject: null, predicat: null, object: null },
}

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setSelectedScore: (state, action) => {
      if (state.scoreIri !== action.payload.scoreIri) {
        state.scoreIri = action.payload.scoreIri
        state.scoreTitle = action.payload.scoreTitle
        state.meiUrl = action.payload.meiUrl
      }
    },
    setHoverEntity: (state, action) => {
      state.hoveredEntity === action.payload
        ? (state.hoveredEntity = initialState.hoveredEntity)
        : (state.hoveredEntity = action.payload)
    },
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
    setAnnotationEditor: (state, action) => {
      state.annotationEditor = state.annotationEditor.subject ? initialState.annotationEditor : action.payload
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
      if (!state.annotationEditor.subject) {
        if (state.inspectedEntities.length > state.currentEntityIndex + 1)
          state.inspectedEntities.splice(
            state.currentEntityIndex + 1,
            state.inspectedEntities.length - state.currentEntityIndex
          )
        const currentEntity = state.inspectedEntities[state.currentEntityIndex]
        const newEntity = action.payload
        state.inspectedEntities.push(findKey(currentEntity) === findKey(newEntity) ? {} : action.payload)
        state.currentEntityIndex = ++state.currentEntityIndex
      }
    },
  },
})

export default scoreSlice

export const {
  setSelectedScore,
  setHoverEntity,
  setInspectedEntity,
  setToPreviousInspection,
  setToNextInspection,
  setTreatise,
  setSelectedEntity,
  setInspectionMode,
  setSelectionMode,
  setAnnotationEditor,
} = scoreSlice.actions
