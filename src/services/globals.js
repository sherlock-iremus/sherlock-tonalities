import { createSlice } from '@reduxjs/toolkit'
import { getId } from '../utils'

const initialState = {
  projectIri: null,
  scoreIri: null,
  noteCount: null,
  colorIndex: 0,
  isUserConnected: true,
  selectedNotes: [],
  selectedConcepts: [],
  hoveredAnnotation: null,
  selectedAnnotation: null,
  selectedAnnotations: [],
  selectedModelIndex: 0,
  isSubSelecting: false,
  isEditing: false,
  annotatedNotes: [],
  filteredAnnotations: [],
}

const globals = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setColorIndex: (state, action) => {
      state.colorIndex = action.payload
    },
    setScoreAnnotator: (state, action) => {
      const { projectIri, scoreIri } = action.payload
      if (projectIri) state.projectIri = projectIri
      if (scoreIri) state.scoreIri = scoreIri
    },
    setIsUserConnected: (state, action) => {
      state.isUserConnected = action.payload
    },
    setSelectedModelIndex: (state, action) => {
      state.selectedModelIndex = action.payload
    },
    setFilteredAnnotations: (state, action) => {
      state.filteredAnnotations = action.payload
    },
    setSelectedNotes: (state, action) => {
      state.selectedConcepts = initialState.selectedConcepts
      if (!action.payload) {
        state.selectedNotes = initialState.selectedNotes
        state.isSubSelecting = initialState.isSubSelecting
        state.isEditing = initialState.isEditing
      } else if (Array.isArray(action.payload))
        state.selectedNotes.push(...action.payload.filter(e => !state.selectedNotes.includes(e)))
      else if (!state.selectedAnnotation || state.isSubSelecting || state.isEditing) {
        const index = state.selectedNotes.findIndex(e => e === action.payload)
        index !== -1 ? state.selectedNotes.splice(index, 1) : state.selectedNotes.push(action.payload)
      }
    },
    setAnnotatedNotes: (state, action) => {
      state.annotatedNotes = [...new Set([...state.annotatedNotes, ...action.payload])]
    },
    unsetAnnotatedNotes: (state, action) => {
      const index = state.annotatedNotes.findIndex(e => e === action.payload[0])
      if (index !== -1) {
        const length = action.payload.length
        state.annotatedNotes.splice(index, length)
      }
    },
    setSelectedConcepts: (state, action) => {
      if (Array.isArray(action.payload)) state.selectedConcepts = action.payload
      else if (!action.payload) state.selectedConcepts = initialState.selectedConcepts
      else {
        const index = state.selectedConcepts.findIndex(e => e === action.payload)
        index !== -1 ? state.selectedConcepts.splice(index, 1) : state.selectedConcepts.push(action.payload)
      }
    },
    setSelectedAnnotation: (state, action) => {
      if (!action.payload) {
        state.selectedAnnotation = initialState.selectedAnnotation
        state.selectedAnnotations = initialState.selectedAnnotations
        state.isSubSelecting = initialState.isSubSelecting
        state.isEditing = initialState.isEditing
      } else {
        state.selectedAnnotations.push(action.payload)
        state.selectedAnnotation = action.payload
        state.selectedNotes = initialState.selectedNotes
      }
    },
    setPreviousAnnotation: state => {
      state.selectedAnnotations.pop()
      state.selectedAnnotation = state.selectedAnnotations[state.selectedAnnotations.length - 1]
    },
    setNoteCount: (state, action) => {
      state.noteCount = action.payload
    },
    setIsSubSelecting: state => {
      if (state.isEditing) state.isEditing = initialState.isEditing
      state.isSubSelecting = !state.isSubSelecting
    },
    setIsEditing: state => {
      if (state.isSubSelecting) state.isSubSelecting = initialState.isSubSelecting
      if (!state.isEditing) {
        state.selectedNotes = state.selectedAnnotation.notes.map(note => getId(note))
        state.selectedAnnotation.notes = initialState.selectedNotes
      }
      else state.selectedNotes = initialState.selectedNotes
      state.isEditing = !state.isEditing
    },
    setHoveredAnnotation: (state, action) => {
      if (!action.payload) state.hoveredAnnotation = initialState.hoveredAnnotation
      else state.hoveredAnnotation = action.payload
    },
  },
})

export default globals

export const {
  setIsUserConnected,
  setSelectedNotes,
  setSelectedModelIndex,
  setSelectedAnnotation,
  setHoveredAnnotation,
  setColorIndex,
  setScoreAnnotator,
  setSelectedConcepts,
  setIsSubSelecting,
  setIsEditing,
  setPreviousAnnotation,
  setNoteCount,
  setAnnotatedNotes,
  unsetAnnotatedNotes,
  setFilteredAnnotations,
} = globals.actions
