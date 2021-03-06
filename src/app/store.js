import { configureStore } from '@reduxjs/toolkit'
import scoreSlice from './services/scoreSlice'
import sherlockApi from './services/sherlockApi'
import sparqlApi from './services/sparql'

export const store = configureStore({
  reducer: {
    score: scoreSlice.reducer,
    sherlockApi: sherlockApi.reducer,
    sparqlApi: sparqlApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sparqlApi.middleware).concat(sherlockApi.middleware),
})
