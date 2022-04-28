import { configureStore } from '@reduxjs/toolkit'
import inspectedEntityReducer from '../features/inspection/inspectedEntitySlice'
import sparqlApi from './services/sparql'

export const store = configureStore({
  reducer: {
    inspectedEntity: inspectedEntityReducer,
    sparqlApi: sparqlApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sparqlApi.middleware),
})
