import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  baseUrl: 'http://data-iremus.huma-num.fr/id/',
  tonalityBaseUrl: 'http://modality-tonality.huma-num.fr/',
  scoreIri: '',
  scoreTitle: '',
  meiUrl: '',
  isUserConnected: true
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
  },
})

export default scoreSlice

export const { setIsUserConnected, setScore } = scoreSlice.actions
