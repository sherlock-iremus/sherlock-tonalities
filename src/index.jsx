import React from 'react'
import { Provider } from 'react-redux'
import { store } from './services/store'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import verovio from 'verovio'

verovio.module.onRuntimeInitialized = () => {
  window.tk = new verovio.toolkit()
  createRoot(document.getElementById('app')).render(
    <React.StrictMode>
      <Provider {...{ store }}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}
