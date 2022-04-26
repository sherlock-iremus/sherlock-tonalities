import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: null, mode: false }

const currentInspectionSlice = createSlice({
  name: 'currentInspection',
  initialState,
  reducers: {
    setCurrentInspection: (state, action) => {
      state.value = action.payload !== state.value ? action.payload : null
    },
    setMode: (state, action) => {
      state.mode = action.payload
    },
  },
})

export const { setCurrentInspection, setMode } = currentInspectionSlice.actions

export default currentInspectionSlice.reducer
