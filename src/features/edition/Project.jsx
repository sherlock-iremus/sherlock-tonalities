/* eslint-disable react-hooks/exhaustive-deps */
import { CollectionsBookmark, Downloading, Edit } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material'
import { TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab'
import { Stack } from '@mui/system'
import { useExportProjectQuery, useGetAnalyticalProjectQuery, useGetAnnotationsQuery } from '../../services/sparql'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Annotation } from './Annotation'
import { AnnotationPage } from '../AnnotationPage'

export const Project = () => {
  const { scoreIri, projectIri, selectedAnnotation } = useSelector(state => state.globals)
  const [isHovered, setIsHovered] = useState(false)
  const [annotationsByPage, setAnnotationsByPage] = useState([])
  const { data: project } = useGetAnalyticalProjectQuery(projectIri, { skip: !projectIri })
  const { data: annotations } = useGetAnnotationsQuery({ scoreIri, projectIri }, { skip: !projectIri })
  const [isDownloading, setIsDownloading] = useState(false)
  const { data } = useExportProjectQuery(projectIri, { skip: !isDownloading })

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

  const downloadFile = async () => {
    try {
      const blob = new Blob([data], { type: 'text/turtle' })
      const file = new File([blob], project.label + '.ttl', { type: 'text/turtle' })
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(file)
      downloadLink.download = project.label + '.ttl'
      downloadLink.click()
      setIsDownloading(false)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (data && isDownloading) downloadFile()
  }, [data])

  if (project && annotations)
    return (
      <Stack flex={1} borderRadius={3} bgcolor="white" boxShadow={1} minHeight={0}>
        <AnnotationPage />
        {!selectedAnnotation && (
          <>
            <ListItem
              dense
              secondaryAction={
                <Tooltip title="Download Turtle file">
                  <IconButton color="inherit" onClick={() => setIsDownloading(true)} edge="end">
                    {isDownloading ? <CircularProgress color="inherit" size={20} /> : <Downloading />}
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
                      Page {page}
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
