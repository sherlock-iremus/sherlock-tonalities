import { CollectionsBookmark } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemButton, ListItemText, Typography, ListSubheader } from '@mui/material'
import { Stack } from '@mui/system'
import { useGetAnalyticalProjectQuery } from '../../app/services/sparql'

export const Project = ({ projectIri }) => {
  const { data: analyticalProject } = useGetAnalyticalProjectQuery(projectIri)

  return !analyticalProject ? null : (
    <Stack flex={1} borderRadius={3} bgcolor="white" boxShadow={1} overflow="scroll">
      <ListItem dense disablePadding>
        <ListItemButton selected>
          <ListItemIcon>
            <CollectionsBookmark />
          </ListItemIcon>
          <ListItemText primary={analyticalProject.label} secondary="Analytical project" />
        </ListItemButton>
      </ListItem>
      <ListSubheader disableSticky>Created annotations</ListSubheader>
      <Stack flex={1} justifyContent="center">
        <Typography textAlign="center" color="text.secondary" fontSize={14} padding={2}>
          No created annotation, start by selecting notes and assigning them concepts
        </Typography>
      </Stack>
    </Stack>
  )
}
