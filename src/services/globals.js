import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  colorIndex: Math.floor(Math.random() * 20),
  isUserConnected: true,
  selectedNotes: [],
  annotations: [],
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
    addAnnotation: (state, action) => {
      if (state.selectedNotes.length) {
        state.annotations.push({
          notes: state.selectedNotes,
          concepts: [action.payload.concept],
          page: action.payload.page,
          date: Date.now(),
        })
        state.selectedNotes = initialState.selectedNotes
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
  addAnnotation,
  setSelectedModelIndex,
  setSelectedAnnotation,
  setHoveredAnnotation,
  setColorIndex,
} = globals.actions
