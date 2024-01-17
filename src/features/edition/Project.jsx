import { CollectionsBookmark, Downloading, Edit } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, Typography, IconButton, Tooltip } from '@mui/material'
import { TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab'
import { Stack } from '@mui/system'
import { useGetAnalyticalProjectQuery, useGetAnnotationsQuery } from '../../services/sparql'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Annotation } from './Annotation'
import { AnnotationPage } from '../AnnotationPage'
import { ExportMenu } from '../ExportMenu'

export const Project = () => {
  const { scoreIri, projectIri, selectedAnnotation } = useSelector(state => state.globals)
  const [isHovered, setIsHovered] = useState(false)
  const [annotationsByPage, setAnnotationsByPage] = useState([])
  const { data: project } = useGetAnalyticalProjectQuery(projectIri, { skip: !projectIri })
  const { data: annotations } = useGetAnnotationsQuery({ scoreIri, projectIri }, { skip: !projectIri })
  const [contextMenu, setContextMenu] = useState(false)

  useEffect(() => {
    if (annotations) {
      const sortedAnnotations = annotations.reduce((group, annotation) => {
        const page = window.tk.getPageWithElement(annotation.noteId)
        const time = window.tk.getTimesForElement(annotation.noteId).realTimeOffsetMilliseconds
        group[page] = group[page] ?? []
        group[page].push({ ...annotation, page, time })
        return group
      }, {})
      Object.keys(sortedAnnotations).forEach(page => sortedAnnotations[page].sort((a, b) => a.time - b.time))
      setAnnotationsByPage(sortedAnnotations)
    }
  }, [annotations])

  if (project && annotations)
    return (
      <Stack flex={1} borderRadius={3} bgcolor="white" boxShadow={1} minHeight={0}>
        <ExportMenu {...{ projectIri, contextMenu, setContextMenu }} filename={project.label} />
        <AnnotationPage />
        {!selectedAnnotation && (
          <>
            <ListItem
              dense
              secondaryAction={
                <Tooltip title="Download Turtle file">
                  <IconButton
                    color="inherit"
                    onClick={event =>
                      setContextMenu(!contextMenu ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null)
                    }
                    edge="end"
                  >
                    <Downloading />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemIcon>
                <IconButton onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                  {isHovered ? <Edit /> : <CollectionsBookmark />}
                </IconButton>
              </ListItemIcon>
              <ListItemText primary={project.label} secondary="Selected project" />
            </ListItem>
            <Stack overflow="auto">
              {annotations.length ? (
                Object.entries(annotationsByPage).map(([page, pageAnnotations]) => (
                  <Stack direction="row" key={page}>
                    <Typography padding={1.5} noWrap fontSize={10}>
                      {page === '0' ? 'Global' : 'Page ' + page}
                    </Typography>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <Stack flex={1} paddingLeft={1}>
                      {pageAnnotations.map(annotation => (
                        <Annotation key={annotation.annotation} {...annotation} color />
                      ))}
                    </Stack>
                  </Stack>
                ))
              ) : (
                <Stack flex={1} justifyContent="center" paddingY={4}>
                  <Typography textAlign="center" color="text.secondary" fontSize={14} padding={2}>
                    No created annotation, start by selecting score items and assigning them concepts
                  </Typography>
                </Stack>
              )}
            </Stack>
          </>
        )}
      </Stack>
    )
}
