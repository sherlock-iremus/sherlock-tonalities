import { ScoreLibrary } from './features/ScoreLibrary'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Tooltip,
} from '@mui/material'
import { ReactComponent as PolifoniaLogo } from './assets/polifonia.svg'
import { grey } from '@mui/material/colors'
import GitHubIcon from '@mui/icons-material/GitHub'
import { Add, AudioFile, ChevronRight, LibraryMusic, RoomService, TextSnippet } from '@mui/icons-material'
import scores from './app/scores.json'
import { AccountMenu } from './features/AccountMenu'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Intro } from './features/Intro'
import { ContributorItem } from './features/items/ContributorItem'
import { Box } from '@mui/system'

export const Landing = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isUserConnected } = useSelector(state => state.score)

  return (
    <Stack height="100vh" flex={1} justifyContent="space-between" alignItems="center" bgcolor={grey[100]}>
      <ScoreLibrary {...{ isOpen, setIsOpen }} />
      <Stack alignSelf="stretch" direction="row" padding={2} justifyContent="space-between" alignItems="center">
        <PolifoniaLogo width="120px" />
        <AccountMenu />
      </Stack>
      <Stack borderRadius="10px" bgcolor="white" boxShadow={1} marginX={2}>
        {!isUserConnected ? (
          <Intro />
        ) : (
          <Stack direction="row" height="60vh">
            <List
              subheader={<ListSubheader>Annotated scores</ListSubheader>}
              disablePadding
              dense
              sx={{ overflow: 'auto' }}
            >
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end">
                    <ChevronRight />
                  </IconButton>
                }
              >
                <ListItemButton selected>
                  <ListItemIcon>
                    <LibraryMusic />
                  </ListItemIcon>
                  <ListItemText primary="All" secondary="View all analytical projects" />
                </ListItemButton>
              </ListItem>
              {scores.map(score => (
                <ListItem
                  key={score.scoreIri}
                  disablePadding
                  secondaryAction={
                    <IconButton edge="end">
                      <ChevronRight />
                    </IconButton>
                  }
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <AudioFile />
                    </ListItemIcon>
                    <ListItemText primary={score.scoreTitle} secondary="Composer" />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <List
              disablePadding
              dense
              sx={{ overflow: 'auto' }}
              subheader={
                <Stack direction="row" justifyContent="space-between">
                  <ListSubheader>Analytical projects</ListSubheader>
                  <Box>
                    <Tooltip title="Create new analytical project" onClick={() => setIsOpen(true)}>
                      <IconButton>
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              }
            >
              {[0, 190820938, 20098097, 3203040, 4000].map(project => (
                <ListItem key={project} disablePadding secondaryAction={<ContributorItem small />}>
                  <ListItemButton>
                    <ListItemIcon>
                      <TextSnippet />
                    </ListItemIcon>
                    <ListItemText primary={'Project n°' + project} secondary="Musicologist" />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Stack>
        )}
      </Stack>
      <Stack alignSelf="end" direction="row" padding={2}>
        <Tooltip title="Source code">
          <IconButton href="https://github.com/sherlock-iremus/sherlock-tonalities">
            <GitHubIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Report bug">
          <IconButton href="https://github.com/sherlock-iremus/sherlock-tonalities/issues/new">
            <RoomService />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
