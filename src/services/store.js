import { configureStore } from '@reduxjs/toolkit'
import globals from './globals'
import service from './service'
import sparql from './sparql'
import model from './model'
import { tokenExpirationHandler } from './service'

export const store = configureStore({
  reducer: {
    globals: globals.reducer,
    service: service.reducer,
    sparql: sparql.reducer,
    model: model.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(service.middleware)
      .concat(sparql.middleware)
      .concat(model.middleware)
      .concat(tokenExpirationHandler),
})
