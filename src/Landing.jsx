import { grey } from '@mui/material/colors'
import { Box } from '@mui/system'
import React from 'react'
import { ScoreLibrary } from './features/ScoreLibrary'
import { ReactComponent as PolifoniaLogo } from './assets/polifonia.svg'
import GitHubIcon from '@mui/icons-material/GitHub'
import { IconButton } from '@mui/material'

export const Landing = () => {
  return (
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
        <IconButton sx={{ marginTop: 2 }} href="https://github.com/sherlock-iremus/sherlock-tonalities">
          <GitHubIcon />
        </IconButton>
      </Box>
    </nav>
  )
}
