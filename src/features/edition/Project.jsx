import { CollectionsBookmark, Downloading, Edit } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, IconButton, Tooltip } from '@mui/material'
import { Stack } from '@mui/system'
import { useGetAnalyticalProjectQuery, useGetAnnotationsQuery } from '../../services/sparql'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { AnnotationPage } from '../AnnotationPage'
import { ExportMenu } from '../ExportMenu'
import { Annotations } from './Annotations'

export const Project = () => {
  const { projectIri, selectedAnnotation } = useSelector(state => state.globals)
  const [isHovered, setIsHovered] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [annotationsByPage, setAnnotationsByPage] = useState([])
  const { data: project } = useGetAnalyticalProjectQuery(projectIri, { skip: !projectIri })
  const { data: annotations } = useGetAnnotationsQuery(projectIri, { skip: !projectIri })
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
        <ExportMenu {...{ contextMenu, setContextMenu }} filename={project.label} />
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
            <Annotations {...{ annotations, annotationsByPage, scrollPosition, setScrollPosition }} />
          </>
        )}
      </Stack>
    )
}
