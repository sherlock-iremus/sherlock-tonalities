import { configureStore } from '@reduxjs/toolkit'
import globals from './globals'
import service from './service'
import sparql from './sparql'
import models from './models'
import { tokenExpirationHandler } from './service'

export const store = configureStore({
  reducer: {
    globals: globals.reducer,
    service: service.reducer,
    sparql: sparql.reducer,
    models: models.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(service.middleware)
      .concat(sparql.middleware)
      .concat(models.middleware)
      .concat(tokenExpirationHandler),
})
