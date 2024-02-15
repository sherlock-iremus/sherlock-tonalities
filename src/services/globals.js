import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectIri: null,
  scoreIri: null,
  noteCount: null,
  colorIndex: Math.floor(Math.random() * 10),
  isUserConnected: true,
  selectedNotes: [],
  selectedConcepts: [],
  hoveredAnnotation: null,
  selectedAnnotation: null,
  selectedAnnotations: [],
  selectedModelIndex: 0,
  isSubSelecting: false,
  annotatedNotes: [],
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
    setSelectedNotes: (state, action) => {
      state.selectedConcepts = initialState.selectedConcepts
      if (!action.payload) {
        state.selectedNotes = initialState.selectedNotes
        state.isSubSelecting = initialState.isSubSelecting
      } else if (Array.isArray(action.payload))
        state.selectedNotes.push(...action.payload.filter(e => !state.selectedNotes.includes(e)))
      else if (!state.selectedAnnotation || state.isSubSelecting) {
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
        state.isSubSelecting = false
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
    setIsSubSelecting: (state, action) => {
      state.isSubSelecting = !state.isSubSelecting
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
  setPreviousAnnotation,
  setNoteCount,
  setAnnotatedNotes,
  unsetAnnotatedNotes,
} = globals.actions
