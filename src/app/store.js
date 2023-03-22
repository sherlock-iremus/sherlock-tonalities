import { configureStore } from '@reduxjs/toolkit'
import scoreSlice from './services/scoreSlice'
import sherlockApi from './services/sherlockApi'
import sparqlApi from './services/sparql'
import ontologies from './services/ontologies'
import { tokenExpirationHandler } from './services/errorHandler'

export const store = configureStore({
  reducer: {
    score: scoreSlice.reducer,
    sherlockApi: sherlockApi.reducer,
    sparqlApi: sparqlApi.reducer,
    ontologies: ontologies.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(sparqlApi.middleware)
      .concat(sherlockApi.middleware)
      .concat(ontologies.middleware)
      .concat(tokenExpirationHandler),
})
