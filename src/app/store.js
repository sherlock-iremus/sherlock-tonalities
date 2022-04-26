import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import currentInspectionReducer from '../features/inspection/currentInspectionSlice'
import sparqlApi from './services/sparql'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    currentInspection: currentInspectionReducer,
    sparqlApi: sparqlApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sparqlApi.middleware),
})
