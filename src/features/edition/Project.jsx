import { CollectionsBookmark, Downloading, Edit } from '@mui/icons-material'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
  ListSubheader,
  Button,
  Typography,
} from '@mui/material'
import { Stack } from '@mui/system'
import { useGetAnalyticalProjectQuery, useGetAnnotationsQuery } from '../../services/sparql'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { AnnotationPage } from '../AnnotationPage'
import { ExportMenu } from '../ExportMenu'
import { Annotations } from './Annotations'
import { EditProjectDialog } from './EditProjectDialog'
import { setColorIndex, setSelectedConcepts, setSelectedNotes } from '../../services/globals'
import { colors } from '../../utils'
import { filterAnnotations } from '../../services/filterAnnotations'

export const Project = () => {
  const { projectIri, selectedAnnotation, colorIndex, filteredAnnotations, selectedNotes, selectedConcepts } =
    useSelector(state => state.globals)
  const [isHovered, setIsHovered] = useState(false)
  const [expandAll, setExpandAll] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [annotationsByPage, setAnnotationsByPage] = useState([])
  const { data: project, refetch } = useGetAnalyticalProjectQuery(projectIri, { skip: !projectIri })
  const { data: annotations } = useGetAnnotationsQuery(projectIri, { skip: !projectIri })
  const [contextMenu, setContextMenu] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => dispatch(filterAnnotations()) && undefined, [selectedConcepts, selectedNotes, dispatch])

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

  useEffect(() => {
    if (project && colorIndex !== project.color)
      colors.map((color, index) => color[500] === project.color && dispatch(setColorIndex(index)))
  }, [project])

  if (project && annotations)
    return (
      <Stack flex={1} borderRadius={3} bgcolor="white" boxShadow={1} minHeight={0}>
        <ExportMenu {...{ contextMenu, setContextMenu }} filename={project.label} />
        <EditProjectDialog {...{ project, isEditing, setIsEditing, refetch }} />
        <AnnotationPage />
        {!selectedAnnotation && (
          <>
            <ListItem
              dense
              secondaryAction={
                <>
                  {project.isPublished ? (
                    <Chip color="success" size="small" label="Published" />
                  ) : (
                    <Chip color="warning" size="small" label="Draft" />
                  )}
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
                </>
              }
            >
              <ListItemIcon>
                <IconButton
                  onClick={() => setIsEditing(true)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered ? <Edit /> : <CollectionsBookmark />}
                </IconButton>
              </ListItemIcon>
              <ListItemText primary={project.label} secondary="Selected project" />
            </ListItem>
            <Stack direction="row" justifyContent="space-between" alignItems="center" pr={2}>
              <ListSubheader disableSticky>Annotations</ListSubheader>
              <Button size="small" onClick={() => setExpandAll(!expandAll)}>
                {expandAll ? 'shrink all' : 'expand all'}
              </Button>
            </Stack>
            {!filteredAnnotations.length && (selectedNotes.length || selectedConcepts.length) ? (
              <Stack flex={1} justifyContent="center" alignItems="center" p={2}>
                <Typography textAlign="center" color="text.secondary" fontSize={14}>
                  No annotation found, select other concept or note
                </Typography>
                {!!selectedNotes.length && (
                  <Button size="small" onClick={() => dispatch(setSelectedNotes())} color="primary">
                    clear notes
                  </Button>
                )}
                {!!selectedConcepts.length && (
                  <Button size="small" onClick={() => dispatch(setSelectedConcepts())} color="primary">
                    clear concepts
                  </Button>
                )}
              </Stack>
            ) : (
              <Annotations {...{ annotations, annotationsByPage, scrollPosition, setScrollPosition, expandAll }} />
            )}
          </>
        )}
      </Stack>
    )
}
