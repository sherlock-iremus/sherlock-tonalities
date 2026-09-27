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
import { useGetSharedProjectsQuery } from '../services/sparql'
import { Delete, TextSnippet } from '@mui/icons-material'
import { getIri, getUuid } from '../utils'
import { useNavigate } from 'react-router-dom'
import { useDeleteAnalyticalProjectMutation } from '../services/service'

export const SharedProjects = ({ userId }) => {
  const { data: projects, refetch } = useGetSharedProjectsQuery(getIri(userId))
  const navigate = useNavigate()
  const [deleteAnalyticalProject, { isLoading }] = useDeleteAnalyticalProjectMutation()

  const removeProject = async projectIri => {
    await deleteAnalyticalProject(getUuid(projectIri))
    refetch()
  }

  return (
    <Stack flex={1} minHeight={0}>
      <ListSubheader disableSticky>Shared analytical projects</ListSubheader>
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
              <ListItemButton onClick={() => navigate(`/project/${getUuid(project.iri)}`)} disabled={isLoading}>
                <ListItemIcon>
                  <TextSnippet />
                </ListItemIcon>
                <ListItemText
                  primary={project.label}
                  secondary={project.annotations === 1 ? 'One selection' : `${project.annotations} selections`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Stack flex={1} justifyContent="center" alignItems="center" padding={2} spacing={2}>
          <Typography textAlign="center" color="text.secondary" fontSize={14}>
            You haven't contributed to any external project yet ! Ask your collaborators to share their analytical projects URL with you.
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
