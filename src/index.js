import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App'
import { store } from './app/store'
import * as serviceWorker from './serviceWorker'
import { ScoreAnnotator } from './features/score/ScoreAnnotator'
import { ConfirmProvider } from 'material-ui-confirm'
import { useGetUserIdQuery } from './app/services/sherlockApi'
import { CoPresent } from '@mui/icons-material'

const TonalitiesRoutes = () => {
  // Sherlock API request to see whether user token is valid or not
  useGetUserIdQuery()

  const { isUserConnected } = useSelector(state => state.score)

  return (
    <Routes>
      {isUserConnected && <Route path="/score/:scoreUuid" element={<ScoreAnnotator />} />}
      <Route path="*" element={<App />} />
    </Routes>
  )
}

window.verovio.module.onRuntimeInitialized = function () {
  window.tk = new window.verovio.toolkit();
  window.tk.setOptions({});
  ReactDOM.render(
    <React.StrictMode>
      <ConfirmProvider>
        <BrowserRouter basename="/tonalities">
          <Provider store={store}>
            <TonalitiesRoutes />
          </Provider>
        </BrowserRouter>
      </ConfirmProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
