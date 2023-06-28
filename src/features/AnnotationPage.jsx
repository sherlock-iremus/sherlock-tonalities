import { Close } from '@mui/icons-material'
import { AppBar, IconButton, ListItem, ListItemText, Slide, Stack, Toolbar, Typography } from '@mui/material'
// import { useGetAssignmentsQuery, useGetP140Query } from '../services/sparql'

export const AnnotationPage = ({ annotation, entity, onClose }) => {
  // const { data: notes } = useGetP140Query(annotation, { skip: !annotation })
  // const { data: assignments } = useGetAssignmentsQuery(entity, { skip: !entity })
  return (
    <Slide direction="up" in={annotation} mountOnEnter unmountOnExit>
      <Stack overflow="auto">
        <AppBar sx={{ position: 'relative', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose}>
              <Close />
            </IconButton>
            <ListItem>
              <ListItemText primary="Analytical entity" />
            </ListItem>
          </Toolbar>
        </AppBar>
        <Stack flex={1} justifyContent="center" paddingY={4}>
          <Typography textAlign="center" color="text.secondary" fontSize={14} padding={2}>
            No comments on this annotation
          </Typography>
        </Stack>
      </Stack>
    </Slide>
  )
}
