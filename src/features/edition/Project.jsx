import { CollectionsBookmark } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, Typography, Button } from '@mui/material'
import { TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab'
import { Stack } from '@mui/system'
import { useGetAnalyticalProjectQuery, useGetAnnotationsQuery } from '../../services/sparql'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Annotation } from './Annotation'
import { AnnotationPage } from '../AnnotationPage'

export const Project = () => {
  const { scoreIri, projectIri, selectedAnnotation } = useSelector(state => state.globals)
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
      <Stack flex={1} borderRadius={3} bgcolor="white" boxShadow={1} minHeight={0}>
        <AnnotationPage />
        {!selectedAnnotation && (
          <>
            <ListItem
              dense
              secondaryAction={
                <Button size="small" disabled>
                  publish
                </Button>
              }
            >
              <ListItemIcon>
                <CollectionsBookmark />
              </ListItemIcon>
              <ListItemText primary={project.label} secondary="Selected project" />
            </ListItem>
            <Stack overflow="auto">
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
                        <Annotation key={annotation.annotation} {...annotation} />
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
            </Stack>
          </>
        )}
      </Stack>
    )
}
