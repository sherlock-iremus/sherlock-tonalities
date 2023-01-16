import { Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Box } from '@mui/system'
import React from 'react'
import './App.css'
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
            <Typography sx={{ pt: 4 }} variant="caption">
              V 2.1
            </Typography>
          </Box>
        </nav>
      </header>
    </div>
  )
}
export default App
