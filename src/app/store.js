import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import sparqlApi from './services/sparql'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    sparqlApi: sparqlApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sparqlApi.middleware),
})
