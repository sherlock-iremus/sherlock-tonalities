import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isUserConnected: true,
  selectedNotes: [],
  selectedConcepts: [],
  selectedModelIndex: 0,
}

const globals = createSlice({
  name: 'globals',
  initialState,
  reducers: {
    setIsUserConnected: (state, action) => {
      state.isUserConnected = action.payload
    },
    setSelectedModelIndex: (state, action) => {
      state.selectedModelIndex = action.payload
    },
    setSelectedNotes: (state, action) => {
      if (!action.payload) {
        state.selectedNotes = initialState.selectedNotes
        state.selectedConcepts = initialState.selectedConcepts
      } else if (Array.isArray(action.payload))
        state.selectedNotes.push(...action.payload.filter(e => !state.selectedNotes.includes(e)))
      else {
        const index = state.selectedNotes.findIndex(e => e === action.payload)
        index !== -1 ? state.selectedNotes.splice(index, 1) : state.selectedNotes.push(action.payload)
      }
    },
    setSelectedConcepts: (state, action) => {
      if (state.selectedNotes.length) {
        if (!action.payload) state.selectedConcepts = initialState.selectedConcepts
        else if (Array.isArray(action.payload))
          state.selectedConcepts.push(...action.payload.filter(e => !state.selectedConcepts.includes(e)))
        else {
          const index = state.selectedConcepts.findIndex(e => e === action.payload)
          index !== -1 ? state.selectedConcepts.splice(index, 1) : state.selectedConcepts.push(action.payload)
        }
      }
    },
  },
})

export default globals

export const { setIsUserConnected, setSelectedNotes, setSelectedConcepts, setSelectedModelIndex } = globals.actions
