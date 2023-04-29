import { ChevronRight, CollectionsBookmark, ExpandMore } from '@mui/icons-material'
import {
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Button,
  Collapse,
} from '@mui/material'
import { TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab'
import { Stack } from '@mui/system'
import { useGetAnalyticalProjectQuery } from '../../services/sparql'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Annotation } from './Annotation'

export const Project = ({ projectIri }) => {
  const [isOpen, setIsOpen] = useState(true)
  const { data: analyticalProject } = useGetAnalyticalProjectQuery(projectIri)
  const { annotations } = useSelector(state => state.globals)
  const [annotationsByPage, setAnnotationsByPage] = useState([])

  useEffect(() => {
    setAnnotationsByPage(
      annotations.reduce((group, annotation) => {
        const { page } = annotation
        group[page] = group[page] ?? []
        group[page].push(annotation)
        return group
      }, {})
    )
  }, [annotations])

  return !analyticalProject ? null : (
    <Stack borderRadius={3} bgcolor="white" boxShadow={1} overflow="scroll">
      <ListItem
        dense
        disablePadding
        secondaryAction={
          <Button size="small" disabled>
            publish
          </Button>
        }
      >
        <ListItemButton selected>
          <IconButton edge="start" disableRipple onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
          <ListItemIcon>
            <CollectionsBookmark />
          </ListItemIcon>
          <ListItemText primary={analyticalProject.label} secondary="Selected project" />
        </ListItemButton>
      </ListItem>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {annotations.length ? (
          Object.entries(annotationsByPage).map(([page, pageAnnotations]) => (
            <Stack direction="row" key={page}>
              <Typography padding={1.5} noWrap fontSize={10}>
                Page {page}
              </Typography>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <Stack flex={1} paddingLeft={1}>
                {pageAnnotations.map(annotation => (
                  <Annotation key={annotation.date} {...{ annotation }} />
                ))}
              </Stack>
            </Stack>
          ))
        ) : (
          <Stack flex={1} justifyContent="center" paddingY={4}>
            <Typography textAlign="center" color="text.secondary" fontSize={14} padding={2}>
              No created annotation, start by selecting notes and assigning them concepts
            </Typography>
          </Stack>
        )}
      </Collapse>
    </Stack>
  )
}
