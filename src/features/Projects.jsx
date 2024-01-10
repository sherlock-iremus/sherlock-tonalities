import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useGetProjectsQuery } from '../services/sparql'
import { TextSnippet } from '@mui/icons-material'
import { getIri, getUuid } from '../utils'
import { useNavigate } from 'react-router-dom'
import { ContributorItem } from './items/ContributorItem'

export const Projects = ({ scoreIri, setIsOpen }) => {
  const { data: projects, isLoading } = useGetProjectsQuery(scoreIri)
  const navigate = useNavigate()

  if (projects && projects.length)
    return (
      <List dense>
        {projects.map(project => (
          <ListItem
            key={project.iri}
            disablePadding
            secondaryAction={<ContributorItem contributorIri={getIri(project.contributor)} />}
          >
            <ListItemButton onClick={() => navigate(`/project/${getUuid(project.iri)}/score/${getUuid(scoreIri)}`)}>
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
    )
  else
    return (
      <Stack flex={1} justifyContent="center" alignItems="center" padding={2} spacing={2}>
        {isLoading && <CircularProgress />}
        <Typography textAlign="center" color="text.secondary" fontSize={14}>
          There is currently no created analytical project for this score
        </Typography>
        <Button size="small" onClick={setIsOpen}>
          Create new analytical project
        </Button>
      </Stack>
    )
}
