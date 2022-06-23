import { grey } from '@mui/material/colors'
import { Box } from '@mui/system'
import React from 'react'
import './App.css'
import { useGetUserIdQuery } from './app/services/sherlockApi'
import { DISCONNECTED } from './features/score/constants'
import { ScoreLibrary } from './features/ScoreLibrary'
import { ReactComponent as PolifoniaLogo } from './images/polifonia.svg'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: grey[100],
            }}
          >
            <PolifoniaLogo width={'100px'} height={'100px'} />
            <ScoreLibrary />
          </Box>
        </nav>
      </header>
    </div>
  )
}
export default App
