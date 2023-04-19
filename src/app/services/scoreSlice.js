import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  tonalityBaseUrl: 'http://modality-tonality.huma-num.fr/',
  scoreIri: '',
  scoreTitle: '',
  meiUrl: '',
  isUserConnected: true,
  selectedNotes: [],
  selectedConcepts: [],
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
    setIsUserConnected: (state, action) => {
      state.isUserConnected = action.payload
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

export default scoreSlice

export const { setIsUserConnected, setScore, setSelectedNotes, setSelectedConcepts } = scoreSlice.actions
