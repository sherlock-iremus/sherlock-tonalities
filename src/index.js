import React from 'react'
import { Provider, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { store } from './app/store'
import { ScoreAnnotator } from './features/score/ScoreAnnotator'
import { ConfirmProvider } from 'material-ui-confirm'
import { useGetUserIdQuery } from './app/services/sherlockApi'
import { Landing } from './Landing'
import { createRoot } from 'react-dom/client'
import * as serviceWorker from './serviceWorker'

const TonalitiesRoutes = () => {
  useGetUserIdQuery()
  const { isUserConnected } = useSelector(state => state.score)

  return (
    <Routes>
      {isUserConnected && <Route path="/score/:scoreUuid" element={<ScoreAnnotator />} />}
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

window.verovio.module.onRuntimeInitialized = function () {
  window.tk = new window.verovio.toolkit()
  const root = createRoot(document.getElementById('app'))
  root.render(
    <React.StrictMode>
      <ConfirmProvider>
        <BrowserRouter basename="/tonalities">
          <Provider {...{ store }}>
            <TonalitiesRoutes />
          </Provider>
        </BrowserRouter>
      </ConfirmProvider>
    </React.StrictMode>
  )
}

serviceWorker.unregister()