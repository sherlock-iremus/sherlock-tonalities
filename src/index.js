import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App'
import { store } from './app/store'
import * as serviceWorker from './serviceWorker'
import { ScoreAnnotator } from './features/score/ScoreAnnotator'
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.render(
  <React.StrictMode>
    <ConfirmProvider>
      <BrowserRouter basename='/tonalities'>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/score/:scoreUuid" element={<ScoreAnnotator />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </ConfirmProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
