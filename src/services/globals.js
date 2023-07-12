import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectIri: null,
  scoreIri: null,
  colorIndex: Math.floor(Math.random() * 10),
  isUserConnected: true,
  selectedNotes: [],
  selectedConcepts: [],
  hoveredAnnotation: null,
  selectedAnnotation: null,
  selectedModelIndex: 0,
}

const globals = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setColorIndex: (state, action) => {
      state.colorIndex = action.payload
    },
    setScoreAnnotator: (state, action) => {
      state.projectIri = action.payload.projectIri
      state.scoreIri = action.payload.scoreIri
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
        state.selectedAnnotation = initialState.selectedAnnotation
      } else if (Array.isArray(action.payload))
        state.selectedNotes.push(...action.payload.filter(e => !state.selectedNotes.includes(e)))
      else if (!state.selectedAnnotation) {
        const index = state.selectedNotes.findIndex(e => e === action.payload)
        index !== -1 ? state.selectedNotes.splice(index, 1) : state.selectedNotes.push(action.payload)
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
      if (!action.payload) state.selectedAnnotation = initialState.selectedAnnotation
      else {
        state.selectedAnnotation = action.payload
        state.selectedNotes = initialState.selectedNotes
      }
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
} = globals.actions
