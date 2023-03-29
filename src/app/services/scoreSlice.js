import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  tonalityBaseUrl: 'http://modality-tonality.huma-num.fr/',
  scoreIri: '',
  scoreTitle: '',
  meiUrl: '',
  isUserConnected: true,
  selectedNotes: [],
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
      if (!action.payload) state.selectedNotes = initialState.selectedNotes
      else if (Array.isArray(action.payload)) {
        state.selectedNotes.push(...action.payload)
      } else {
        const index = state.selectedNotes.findIndex(e => e === action.payload)
        index !== -1 ? state.selectedNotes.splice(index, 1) : state.selectedNotes.push(action.payload)
      }
    },
  },
})

export default scoreSlice

export const { setIsUserConnected, setScore, setSelectedNotes } = scoreSlice.actions
