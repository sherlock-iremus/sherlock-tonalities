import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  scoreIri: 'http://data-iremus.huma-num.fr/id/eff6f0a7-cf80-402c-953b-c66161051356',
  meiUrl: 'http://data-iremus.huma-num.fr/files/modality-tonality/mei/eff6f0a7-cf80-402c-953b-c66161051356.mei',
  clickedNoteId: null,
  inspectedNoteId: null,
  inspectedVerticalityId: null,
  inspectedPositionnedNoteId: null,
  inspectedSelectionId: null,
  inspectedConceptId: null,
  isInspectionMode: true,
}

const inspectedEntitySlice = createSlice({
  name: 'inspectedEntity',
  initialState,
  reducers: {
    setInspectedNoteId: (state, action) => {
      state.clickedNoteId = (action.payload === state.clickedNoteId) ? null : action.payload
      state.inspectedNoteId = (action.payload === state.inspectedNoteId) ? null : action.payload
      state.inspectedVerticalityId = null
      state.inspectedPositionnedNoteId= null
      state.inspectedSelectionId = null
      state.inspectedConceptId = null
    },
    setConceptId: (state, action) => {
      state.inspectedConceptId = (action.payload === state.inspectedConceptId) ? null : action.payload
      state.inspectedNoteId = null
      state.inspectedVerticalityId = null
      state.inspectedPositionnedNoteId= null
      state.inspectedSelectionId = null
      state.clickedNoteId = null
    },
  },
})

export const { setInspectedNoteId, setConceptId } = inspectedEntitySlice.actions

export default inspectedEntitySlice.reducer
