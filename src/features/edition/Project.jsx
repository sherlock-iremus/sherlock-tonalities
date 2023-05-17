import { ChevronRight, CollectionsBookmark, ExpandMore } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, Typography, IconButton, Button, Collapse } from '@mui/material'
import { TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab'
import { Stack } from '@mui/system'
import { useGetAnalyticalProjectQuery, useGetAnnotationsQuery } from '../../services/sparql'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Annotation } from './Annotation'
import { Loader } from '../../components/Loader'

export const Project = () => {
  const [isOpen, setIsOpen] = useState(true)
  const { scoreIri, projectIri } = useSelector(state => state.globals)
  const [annotationsByPage, setAnnotationsByPage] = useState([])
  const { data: project } = useGetAnalyticalProjectQuery(projectIri, { skip: !projectIri })
  const { data: annotations } = useGetAnnotationsQuery({ scoreIri, projectIri }, { skip: !projectIri })

  useEffect(() => {
    if (annotations)
      setAnnotationsByPage(
        annotations.reduce((group, annotation) => {
          const { page } = annotation
          group[page] = group[page] ?? []
          group[page].push(annotation)
          return group
        }, {})
      )
  }, [annotations])

  if (project && annotations)
    return (
      <Stack borderRadius={3} bgcolor="white" boxShadow={1} overflow="hidden">
        <ListItem
          dense
          secondaryAction={
            <Button size="small" disabled>
              publish
            </Button>
          }
        >
          <IconButton edge="start" disableRipple onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ExpandMore /> : <ChevronRight />}
          </IconButton>
          <ListItemIcon>
            <CollectionsBookmark />
          </ListItemIcon>
          <ListItemText primary={project.label} secondary="Selected project" />
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
                    <Annotation key={annotation.entity} {...annotation} />
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
