import { configureStore } from '@reduxjs/toolkit'
import scoreSlice from '../features/slice/scoreSlice'
import sparqlApi from './services/sparql'

export const store = configureStore({
  reducer: {
    score: scoreSlice,
    sparqlApi: sparqlApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sparqlApi.middleware),
})
