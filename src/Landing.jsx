import { ScoreLibrary } from './features/ScoreLibrary'
import { IconButton, Stack } from '@mui/material'
import { ReactComponent as PolifoniaLogo } from './assets/polifonia.svg'
import { grey } from '@mui/material/colors'
import GitHubIcon from '@mui/icons-material/GitHub'

export const Landing = () => (
  <Stack height="100vh" justifyContent="space-between" alignItems="center" bgcolor={grey[100]}>
    <PolifoniaLogo style={{ alignSelf: 'start', padding: 16 }} width="150px" />
    <ScoreLibrary />
    <IconButton sx={{ alignSelf: 'end', padding: 2 }} href="https://github.com/sherlock-iremus/sherlock-tonalities">
      <GitHubIcon />
    </IconButton>
  </Stack>
)
