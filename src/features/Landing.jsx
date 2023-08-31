import { NewProject } from './NewProject'
import {
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
import GitHubIcon from '@mui/icons-material/GitHub'
import { Add, AudioFile, BugReport, ChevronRight, Language, LibraryMusic } from '@mui/icons-material'
import { AccountMenu } from './AccountMenu'
import { useState } from 'react'
import { Intro } from './Intro'
import { useGetUserIdQuery } from '../services/service'
import scores from '../config/scores.json'
import { ThemePicker } from './ThemePicker'
import { Projects } from './Projects'

export const Landing = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedScoreIndex, setSelectedScoreIndex] = useState(-1)
  const [upload, setUpload] = useState(null)

  const { data: userId } = useGetUserIdQuery()

  const isAllScoresSelected = selectedScoreIndex === scores.length
  const isScoreSelected = selectedScoreIndex !== -1

  return (
    <Stack height="100vh" justifyContent="space-between" alignItems="center" bgcolor="secondary.light">
      <NewProject
        {...{ isOpen, upload, score: scores[selectedScoreIndex] }}
        onClose={() => (isOpen && setIsOpen(false)) || (upload && setUpload(null))}
      />
      <Stack alignSelf="stretch" direction="row" padding={2} justifyContent="space-between" alignItems="center">
        <PolifoniaLogo width="100px" />
        <AccountMenu />
        <ThemePicker />
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
                <ListSubheader>Available scores</ListSubheader>
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
                {isScoreSelected && !isAllScoresSelected ? (
                  <Projects scoreIri={scores[selectedScoreIndex].scoreIri} setIsOpen={() => setIsOpen(true)} />
                ) : (
                  <Stack
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                    onDrop={e => {
                      e.preventDefault()
                      setUpload(e.dataTransfer.files[0])
                    }}
                    onDragOver={e => e.preventDefault()}
                    onDragEnter={e => {
                      e.preventDefault()
                      e.target.style.backgroundColor = 'grey'
                    }}
                    onDragLeave={e => {
                      e.preventDefault()
                      e.target.style.backgroundColor = 'transparent'
                    }}
                  >
                    <Typography textAlign="center" color="text.secondary" fontSize={14}>
                      No score selected, start by selecting one in the list or drag MEI file here
                    </Typography>
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
            <BugReport />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
