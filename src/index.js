import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { App } from './App'

window.verovio.module.onRuntimeInitialized = () => {
  window.tk = new window.verovio.toolkit()
  const root = createRoot(document.getElementById('app'))

  root.render(
    <React.StrictMode>
      <BrowserRouter basename="/sherlock-tonalities/">
        <ThemeProvider {...{ theme }}>
          <ReduxProvider {...{ store }}>
            <App />
          </ReduxProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}
