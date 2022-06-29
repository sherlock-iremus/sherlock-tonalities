import { createSlice } from '@reduxjs/toolkit'
import { findKey } from '../../features/score/utils'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  tonalityBaseUrl: 'http://modality-tonality.huma-num.fr/',
  scoreIri: '',
  scoreTitle: '',
  meiUrl: '',
  treatiseIri: 'http://modality-tonality.huma-num.fr/Zarlino_1558#',
  isInspectionMode: true,
  isSelectionMode: false,
  inspectedEntities: [{}],
  currentEntityIndex: 0,
  editingSelectionIri: '',
  selectedEntities: [],
  focusEntityIndex: -1,
  hoveredEntity: {},
  annotationEditor: { subject: null, predicat: null, object: null },
}

const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setScore: (state, action) => {
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
    setTreatiseIri: (state, action) => {
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
      state.selectedEntities = []
    },
    setInspectionMode: state => {
      state.isInspectionMode = true
      state.isSelectionMode = false
      state.selectedEntities = []
      state.editingSelectionIri = ''
    },
    setAnnotationEditor: (state, action) => {
      state.annotationEditor = state.annotationEditor.subject ? initialState.annotationEditor : action.payload
    },
    setEditingSelection: (state, action) => {
      state.editingSelectionIri = action.payload.selectionIri
      state.selectedEntities = action.payload.children
      state.isInspectionMode = false
      state.isSelectionMode = true
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
        state.inspectedEntities.push(findKey(currentEntity) === findKey(newEntity) ? initialState.inspectedEntities[0] : action.payload)
        state.currentEntityIndex = ++state.currentEntityIndex
      }
    },
  },
})

export default scoreSlice

export const {
  setScore,
  setHoverEntity,
  setInspectedEntity,
  setToPreviousInspection,
  setToNextInspection,
  setTreatiseIri,
  setSelectedEntity,
  setInspectionMode,
  setSelectionMode,
  setAnnotationEditor,
  setEditingSelection,
} = scoreSlice.actions
