import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectIri: null,
  scoreIri: null,
  colorIndex: Math.floor(Math.random() * 10),
  isUserConnected: true,
  selectedNotes: [],
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
      if (!action.payload) {
        state.selectedNotes = initialState.selectedNotes
        state.selectedAnnotation = initialState.selectedAnnotation
      } else if (Array.isArray(action.payload))
        state.selectedNotes.push(...action.payload.filter(e => !state.selectedNotes.includes(e)))
      else {
        const index = state.selectedNotes.findIndex(e => e === action.payload)
        index !== -1 ? state.selectedNotes.splice(index, 1) : state.selectedNotes.push(action.payload)
      }
    },
    setSelectedAnnotation: (state, action) => {
      if (!action.payload) state.selectedAnnotation = initialState.selectedAnnotation
      else state.selectedAnnotation = state.annotations.find(a => a.date === action.payload)
    },
    setHoveredAnnotation: (state, action) => {
      if (!action.payload) state.hoveredAnnotation = initialState.hoveredAnnotation
      else state.hoveredAnnotation = state.annotations.find(a => a.date === action.payload)
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
} = globals.actions
