import {
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material'
import { useGetPersonalProjectsQuery } from '../services/sparql'
import { TextSnippet } from '@mui/icons-material'
import { getIri, getUuid } from '../utils'
import { useNavigate } from 'react-router-dom'

export const PersonalProjects = ({ userId }) => {
  const { data: projects, isFetching } = useGetPersonalProjectsQuery(getIri(userId))
  const navigate = useNavigate()
  console.log(projects)
  return (
    <Stack flex={1}>
      <ListSubheader>Personal analytical projects</ListSubheader>
      {projects?.length ? (
        <List dense>
          {projects.map(project => (
            <ListItemButton
              key={project.iri}
              onClick={() => navigate(`/project/${getUuid(project.iri)}/score/${getUuid(project.scoreIri)}`)}
            >
              <ListItemIcon>
                <TextSnippet />
              </ListItemIcon>
              <ListItemText
                primary={project.label}
                secondary={project.annotations === 1 ? 'One annotation' : `${project.annotations} annotations`}
              />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Stack flex={1} justifyContent="center" alignItems="center" padding={2} spacing={2}>
          {isFetching && <CircularProgress />}
          <Typography textAlign="center" color="text.secondary" fontSize={14}>
            You haven't worked on any project yet ! Start by selecting one from the list
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
