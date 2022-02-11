import React from 'react'
import { Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <Link to="/mei">MEI Viewer</Link>
          <Link to="/library">Score & Analysis Library</Link>
        </nav>
      </header>
    </div>
  )
}

export default App
