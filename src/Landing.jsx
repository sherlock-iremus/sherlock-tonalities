import { ScoreLibrary } from './features/ScoreLibrary'
import { IconButton, Stack, Tooltip } from '@mui/material'
import { ReactComponent as PolifoniaLogo } from './assets/polifonia.svg'
import { grey } from '@mui/material/colors'
import GitHubIcon from '@mui/icons-material/GitHub'
import { RoomService } from '@mui/icons-material'

export const Landing = () => (
  <Stack height="100vh" justifyContent="space-between" alignItems="center" bgcolor={grey[100]}>
    <PolifoniaLogo style={{ alignSelf: 'start', padding: 16 }} width="150px" />
    <ScoreLibrary />
    <Stack direction="row" alignSelf="end" padding={2}>
      <Tooltip title="Source code">
        <IconButton href="https://github.com/sherlock-iremus/sherlock-tonalities">
          <GitHubIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Open issue">
        <IconButton href="https://github.com/sherlock-iremus/sherlock-tonalities">
          <RoomService />
        </IconButton>
      </Tooltip>
    </Stack>
  </Stack>
)
