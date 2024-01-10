import { NewProject } from './NewProject'
import {
  Chip,
  Divider,
  Grid,
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
import PolifoniaLogo from '../assets/polifonia.svg'
import GitHubIcon from '@mui/icons-material/GitHub'
import { Add, AudioFile, BugReport, ChevronRight, Help, Language, LibraryMusic, UploadFile } from '@mui/icons-material'
import { AccountMenu } from './AccountMenu'
import { useEffect, useState } from 'react'
import { Intro } from './Intro'
import { useGetUserIdQuery } from '../services/service'
import scores from '../config/scores.json'
import { Projects } from './Projects'
import { PersonalProjects } from './PersonalProjects'
import { Input } from '../components/Input'

export const Landing = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedScoreIri, setSelectedScoreIri] = useState('')
  const [upload, setUpload] = useState(null)
  const [filter, setFilter] = useState('')
  const [selectedComposers, setSelectedComposers] = useState([])
  const { data: userId } = useGetUserIdQuery()
  const [isRecentOpen, setIsRecentOpen] = useState(false)

  const isScoreSelected = selectedScoreIri && !isRecentOpen
  const composers = ['Dufay', 'Josquin', 'Zarlino', 'Bach', 'Fontanelli', 'Hellinck', 'Lechner', 'Willaert']

  useEffect(() => {
    if (selectedScoreIri && isRecentOpen) setIsRecentOpen(false)
  }, [selectedScoreIri])

  useEffect(() => {
    if (selectedScoreIri && isRecentOpen) setSelectedScoreIri('')
  }, [isRecentOpen])

  return (
    <Stack height="100vh" justifyContent="space-between" alignItems="center" bgcolor="secondary.light">
      <NewProject
        {...{ isOpen, upload, score: scores.find(e => e.scoreIri === selectedScoreIri) }}
        onClose={() => (isOpen && setIsOpen(false)) || (upload && setUpload(null))}
      />
      <Stack alignSelf="stretch" direction="row" padding={2} justifyContent="space-between" alignItems="center">
        <img src={PolifoniaLogo} width="100px" />
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
                <ListSubheader>Recent projects</ListSubheader>
                <ListItem
                  disablePadding
                  dense
                  secondaryAction={
                    <IconButton edge="end" disableRipple>
                      <ChevronRight />
                    </IconButton>
                  }
                >
                  <ListItemButton selected={isRecentOpen} onClick={() => setIsRecentOpen(!isRecentOpen)}>
                    <ListItemIcon>
                      <LibraryMusic />
                    </ListItemIcon>
                    <ListItemText primary="My analytical projects" secondary="View recent analytical projects" />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListSubheader>Available scores</ListSubheader>
                <Input
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="Search score by title..."
                />
                <Grid padding={1}>
                  {composers.map((composer, index) => (
                    <Chip
                      key={index}
                      label={composer}
                      variant={selectedComposers.includes(composer) ? 'filled' : 'outlined'}
                      onClick={() =>
                        selectedComposers.includes(composer)
                          ? setSelectedComposers(selectedComposers.filter(e => e !== composer))
                          : setSelectedComposers([...selectedComposers, composer])
                      }
                    />
                  ))}
                </Grid>
                <List disablePadding dense sx={{ overflow: 'auto' }}>
                  {scores
                    .filter(e =>
                      selectedComposers.length ? selectedComposers.some(c => e.scoreComposer.includes(c)) : true
                    )
                    .filter(e => (filter ? e.scoreTitle.includes(filter) : true))
                    .map(({ scoreIri, scoreTitle, scoreComposer }) => (
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
                          selected={selectedScoreIri === scoreIri}
                          onClick={() => setSelectedScoreIri(selectedScoreIri === scoreIri ? '' : scoreIri)}
                        >
                          <ListItemIcon>
                            <AudioFile />
                          </ListItemIcon>
                          <ListItemText primary={scoreTitle} secondary={scoreComposer} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Stack>
              <Divider orientation="vertical" />
              <Stack flex={1} minWidth={0}>
                {isRecentOpen ? (
                  <PersonalProjects userId={userId} />
                ) : isScoreSelected ? (
                  <Stack flex={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" pr={0.5}>
                      <ListSubheader sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {`Analytical projects for ${scores.find(e => e.scoreIri === selectedScoreIri).scoreTitle}`}
                      </ListSubheader>
                      <Stack>
                        <Tooltip title="Create new analytical project" onClick={() => setIsOpen(true)}>
                          <IconButton>
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                    <Projects scoreIri={selectedScoreIri} setIsOpen={() => setIsOpen(true)} />
                  </Stack>
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
                    <Tooltip title="Upload MEI file">
                      <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden accept=".mei" type="file" onChange={e => setUpload(e.target.files[0])} />
                        <UploadFile />
                      </IconButton>
                    </Tooltip>
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
        <Tooltip title="Documentation">
          <IconButton href="https://tonalities.gitpages.huma-num.fr">
            <Help />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
