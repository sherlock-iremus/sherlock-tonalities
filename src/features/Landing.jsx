import { NewProject } from './NewProject'
import {
  Chip,
  Divider,
  Grid,
  IconButton,
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
import { Add, AddCircle, ChevronRight, Feedback, Help, Language, LibraryMusic } from '@mui/icons-material'
import { AccountMenu } from './AccountMenu'
import { useEffect, useState } from 'react'
import { Intro } from './Intro'
import { useGetUserIdQuery } from '../services/service'
import { Projects } from './Projects'
import { PersonalProjects } from './PersonalProjects'
import { Input } from '../components/Input'
import { composers } from '../utils'
import { VirtualizedList } from './score/VirtualizedList'

export const Landing = () => {
  const [scores, setScores] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedScoreId, setSelectedScoreId] = useState('')
  const [filter, setFilter] = useState('')
  const [selectedComposers, setSelectedComposers] = useState([])
  const { data: userId } = useGetUserIdQuery()
  const [isRecentOpen, setIsRecentOpen] = useState(false)

  const isScoreSelected = selectedScoreId && !isRecentOpen

  const fetchScores = async () =>
    setScores(
      await (
        await fetch(
          'https://gitlab.huma-num.fr/api/v4/projects/3940/jobs/artifacts/main/raw/public/scores.json?job=scores'
        )
      ).json()
    )

  useEffect(() => {
    if (selectedScoreId && isRecentOpen) setIsRecentOpen(false)
  }, [selectedScoreId])

  useEffect(() => {
    if (selectedScoreId && isRecentOpen) setSelectedScoreId('')
  }, [isRecentOpen])

  useEffect(() => {
    fetchScores()
  }, [])

  return (
    <Stack height="100vh" justifyContent="space-between" alignItems="center" bgcolor="secondary.light">
      <NewProject
        {...{ isOpen, score: scores.find(e => e.meiUrl === selectedScoreId) }}
        onClose={() => setIsOpen(false)}
      />
      <Stack alignSelf="stretch" direction="row" padding={2} justifyContent="space-between" alignItems="center">
        <img src={PolifoniaLogo} width="100px" />
        <AccountMenu />
      </Stack>
      <Stack borderRadius={3} bgcolor="white" boxShadow={1} marginX={4} minHeight={0}>
        <Stack direction="row" minHeight={0}>
          <Stack flex={1}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" spacing={0.5} p={2}>
                <Typography variant="h5">Tonalities</Typography>
                <Typography fontSize={12} variant="h6">
                  2.1
                </Typography>
              </Stack>
              <Stack p={1}>
                <Tooltip title="Visit documentation">
                  <IconButton size="small" href="https://tonalities.gitpages.huma-num.fr">
                    <Help />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            <Intro />
          </Stack>
          {userId && (
            <Stack direction="row" flex={3}>
              <Divider orientation="vertical" />
              <Stack flex={1}>
                <ListSubheader>Available scores</ListSubheader>
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
                    <ListItemText primary="My recent work" secondary="View recent analytical projects" />
                  </ListItemButton>
                </ListItem>
                <Grid p={1}>
                  {Object.values(composers).map((composer, index) => (
                    <Chip
                      sx={{ margin: 0.2 }}
                      key={index}
                      size="small"
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
                <Input
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  placeholder="Search score by title..."
                />
                <VirtualizedList {...{ scores, selectedComposers, filter, selectedScoreId, setSelectedScoreId }} />
              </Stack>
              <Divider orientation="vertical" />
              <Stack flex={1} minWidth={0}>
                {isRecentOpen ? (
                  <PersonalProjects userId={userId} />
                ) : isScoreSelected ? (
                  <Stack flex={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" pr={0.5}>
                      <ListSubheader sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {`Analytical projects for ${scores.find(e => e.meiUrl === selectedScoreId).scoreTitle}`}
                      </ListSubheader>
                      <Stack>
                        <Tooltip title="Create new analytical project" onClick={() => setIsOpen(true)}>
                          <IconButton>
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                    <Projects meiUrl={selectedScoreId} setIsOpen={() => setIsOpen(true)} />
                  </Stack>
                ) : (
                  <Stack flex={1} justifyContent="center" alignItems="center" p={2}>
                    <Typography textAlign="center" color="text.secondary" fontSize={14}>
                      No score selected, start by selecting one in the list or add MEI file
                    </Typography>
                    <Tooltip title="Add MEI from URL">
                      <IconButton onClick={() => setIsOpen(true)} color="primary">
                        <AddCircle />
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
            <Feedback />
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
