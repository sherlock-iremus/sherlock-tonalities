import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Link } from 'react-router-dom'
import './App.css'

const App = () => (
  <div className="App">
    <header className="App-header">
      <nav>
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link to="/score">
            <Typography variant="button">Score annotator</Typography>
          </Link>
        </Box>
        {/* <Link to="/library">Score & Analysis Library</Link> */}
      </nav>
    </header>
  </div>
)

export default App
