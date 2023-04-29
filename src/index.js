import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { store } from './services/store'
import { createRoot } from 'react-dom/client'
import { App } from './App'

window.verovio.module.onRuntimeInitialized = () => {
  window.tk = new window.verovio.toolkit()
  const root = createRoot(document.getElementById('app'))

  root.render(
    <React.StrictMode>
      <HashRouter>
        <ReduxProvider {...{ store }}>
          <App />
        </ReduxProvider>
      </HashRouter>
    </React.StrictMode>
  )
}
