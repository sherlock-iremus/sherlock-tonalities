import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material'
import { useGetPersonalProjectsQuery } from '../services/sparql'
import { Delete, TextSnippet } from '@mui/icons-material'
import { getIri, getUuid } from '../utils'
import { useNavigate } from 'react-router-dom'
import { useDeleteAnalyticalProjectMutation } from '../services/service'

export const PersonalProjects = ({ userId }) => {
  const { data: projects, isFetching, refetch } = useGetPersonalProjectsQuery(getIri(userId))
  const navigate = useNavigate()
  const [deleteAnalyticalProject] = useDeleteAnalyticalProjectMutation()

  const removeProject = async projectIri => {
    await deleteAnalyticalProject(getUuid(projectIri))
    refetch()
  }

  return (
    <Stack flex={1} minHeight={0}>
      <ListSubheader disableSticky>Personal analytical projects</ListSubheader>
      {projects?.length ? (
        <List dense sx={{ overflow: 'auto' }}>
          {projects.map(project => (
            <ListItem
              key={project.iri}
              disablePadding
              secondaryAction={
                <IconButton size="small" onClick={() => removeProject(project.iri)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => navigate(`/project/${getUuid(project.iri)}`)}>
                <ListItemIcon>
                  <TextSnippet />
                </ListItemIcon>
                <ListItemText
                  primary={project.label}
                  secondary={project.annotations === 1 ? 'One annotation' : `${project.annotations} annotations`}
                />
              </ListItemButton>
            </ListItem>
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
