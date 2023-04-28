import { NewProject } from './NewProject'
import {
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { ReactComponent as PolifoniaLogo } from '../assets/polifonia.svg'
import { grey } from '@mui/material/colors'
import GitHubIcon from '@mui/icons-material/GitHub'
import {
  Add,
  AudioFile,
  ChevronRight,
  Language,
  LibraryMusic,
  RoomService,
  SwapHoriz,
  TextSnippet,
} from '@mui/icons-material'
import { AccountMenu } from './AccountMenu'
import { useState } from 'react'
import { Intro } from './Intro'
import { ContributorItem } from './items/ContributorItem'
import { useGetUserIdQuery } from '../services/service'
import scores from '../config/scores.json'

export const Landing = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedScoreIndex, setSelectedScoreIndex] = useState(-1)
  const { data: userId } = useGetUserIdQuery()

  const isAllScoresSelected = selectedScoreIndex === scores.length
  const isScoreSelected = selectedScoreIndex !== -1

  return (
    <Stack height="100vh" justifyContent="space-between" alignItems="center" bgcolor={grey[100]}>
      {isScoreSelected && !isAllScoresSelected && (
        <NewProject {...{ isOpen, setIsOpen, score: scores[selectedScoreIndex] }} />
      )}
      <Stack alignSelf="stretch" direction="row" padding={2} justifyContent="space-between" alignItems="center">
        <PolifoniaLogo width="100px" />
        <AccountMenu />
      </Stack>
      <Stack borderRadius={3} bgcolor="white" boxShadow={1} marginX={4} minHeight={0}>
        <Stack direction="row" minHeight={0}>
          <Stack flex={2}>
            <Stack direction="row" spacing={0.5} p={2}>
              <Typography variant="h5">Tonalities</Typography>
              <Typography fontSize={12} variant="h6">
                2.0
              </Typography>
            </Stack>
            <Intro />
          </Stack>
          {userId && (
            <Stack direction="row" flex={3}>
              <Divider orientation="vertical" />
              <Stack flex={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" pr={0.5}>
                  <ListSubheader>Available scores</ListSubheader>
                  <Stack>
                    <IconButton disabled>
                      <SwapHoriz />
                    </IconButton>
                  </Stack>
                </Stack>
                <List disablePadding dense sx={{ overflow: 'auto' }}>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <IconButton edge="end" disableRipple>
                        <ChevronRight />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      selected={isAllScoresSelected}
                      onClick={() => setSelectedScoreIndex(!isAllScoresSelected ? scores.length : -1)}
                    >
                      <ListItemIcon>
                        <LibraryMusic />
                      </ListItemIcon>
                      <ListItemText primary="All scores" secondary="View all analytical projects" />
                    </ListItemButton>
                  </ListItem>
                  {scores.map(({ scoreIri, scoreTitle }, index) => (
                    <ListItem
                      key={scoreIri}
                      disablePadding
                      secondaryAction={
                        <IconButton edge="end" disableRipple>
                          <ChevronRight />
                        </IconButton>
                      }
                    >
                      <ListItemButton
                        selected={selectedScoreIndex === index}
                        onClick={() => setSelectedScoreIndex(selectedScoreIndex !== index ? index : -1)}
                      >
                        <ListItemIcon>
                          <AudioFile />
                        </ListItemIcon>
                        <ListItemText primary={scoreTitle} secondary="Composer" />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Stack>
              <Divider orientation="vertical" />
              <Stack flex={1} minWidth={0}>
                {isScoreSelected && (
                  <Stack direction="row" justifyContent="space-between" alignItems="center" pr={0.5}>
                    <ListSubheader sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      Analytical projects for{' '}
                      {isAllScoresSelected ? 'all scores' : scores[selectedScoreIndex].scoreTitle}
                    </ListSubheader>
                    {!isAllScoresSelected && (
                      <Stack>
                        <Tooltip title="Create new analytical project" onClick={() => setIsOpen(true)}>
                          <IconButton>
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </Stack>
                )}
                {isAllScoresSelected ? (
                  <List disablePadding dense sx={{ overflow: 'auto' }}>
                    {[0, 1, 2, 3, 4].map(project => (
                      <ListItem key={project} disablePadding secondaryAction={<ContributorItem small />}>
                        <ListItemButton>
                          <ListItemIcon>
                            <TextSnippet />
                          </ListItemIcon>
                          <ListItemText primary={'Project n°' + project} secondary="Félix Poullet-Pagès" />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Stack flex={1} justifyContent="center" alignItems="center" p={2}>
                    <Typography textAlign="center" color="text.secondary" fontSize={14}>
                      {isScoreSelected
                        ? 'There is currently no created analytical project for this score'
                        : 'No score selected, start by selecting a score to browse analytical projects'}
                    </Typography>
                    {isScoreSelected && (
                      <Button size="small" onClick={() => setIsOpen(true)}>
                        Create new analytical project
                      </Button>
                    )}
                  </Stack>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Stack alignSelf="end" direction="row" padding={2}>
        <Tooltip title="Polifonia website">
          <IconButton href="https://polifonia-project.eu/pilots/tonalities/">
            <Language />
          </IconButton>
        </Tooltip>
        <Tooltip title="Source code">
          <IconButton href="https://github.com/sherlock-iremus/sherlock-tonalities">
            <GitHubIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Report a bug">
          <IconButton href="https://github.com/sherlock-iremus/sherlock-tonalities/issues/new">
            <RoomService />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
