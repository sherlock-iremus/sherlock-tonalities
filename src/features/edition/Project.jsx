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
import { useGetAnalyticalProjectQuery, useGetAnnotationsQuery, useGetFlatAnnotationsQuery } from '../../services/sparql'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { AnnotationPage } from '../AnnotationPage'
import { ExportMenu } from '../ExportMenu'
import { Annotations } from './Annotations'
import { EditProjectDialog } from './EditProjectDialog'
import { setColorIndex, setSelectedConcepts, setSelectedNotes } from '../../services/globals'
import { colors, getIri, getUuid } from '../../utils'
import { filterAnnotations } from '../../services/filterAnnotations'
import { useSearchParams } from 'react-router-dom'
import { setAnnotation } from '../../services/setAnnotation'
import { useGetUserIdQuery } from '../../services/service'
import { Loader } from '../../components/Loader'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { Annotation } from './Annotation'
import { handleDrag } from '../../services/handleDrag'

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

  const { data: userId } = useGetUserIdQuery()
  const canEdit = getIri(userId) === project?.contributor

  const [searchParams, setSearchParams] = useSearchParams()
  const [initialAnnotationId] = useState(searchParams.get('annotation'))

  useEffect(() => {
    if (initialAnnotationId && !selectedAnnotation) dispatch(setAnnotation(getIri(initialAnnotationId)))
  }, [initialAnnotationId])

  useEffect(() => {
    setSearchParams(selectedAnnotation ? { annotation: getUuid(selectedAnnotation?.entity) } : {})
  }, [selectedAnnotation])

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

  const { data: flatAnnotations } = useGetFlatAnnotationsQuery(projectIri, { skip: !projectIri })
  const [draggedAnnotation, setDraggedAnnotation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const onDragStart = event => setDraggedAnnotation(flatAnnotations.find(a => a.annotation === event.active.id))
  const onDragEnd = async event => {
    setIsLoading(true)
    try {
      if (event.over.id)
        await dispatch(handleDrag({ draggedIri: draggedAnnotation.annotation, droppedOnIri: event.over.id })).unwrap()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
      setDraggedAnnotation(null)
    }
  }

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
                  onClick={() => canEdit && setIsEditing(true)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered && canEdit ? <Edit /> : <CollectionsBookmark />}
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
              <>
                <Loader {...{ isLoading }} />
                <DndContext {...{ onDragStart, onDragEnd }}>
                  <DragOverlay>
                    {draggedAnnotation ? <Annotation {...draggedAnnotation} expandAll={false} isDragging /> : null}
                  </DragOverlay>
                  <Annotations {...{ annotations, annotationsByPage, scrollPosition, setScrollPosition, expandAll }} />
                </DndContext>
              </>
            )}
          </>
        )}
      </Stack>
    )
}
