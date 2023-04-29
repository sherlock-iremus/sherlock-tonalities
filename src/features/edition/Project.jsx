import { ChevronRight, CollectionsBookmark, Comment, ExpandMore } from '@mui/icons-material'
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
import { TimelineItem, TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab'
import { Stack } from '@mui/system'
import { useGetAnalyticalProjectQuery } from '../../services/sparql'
import { useDispatch, useSelector } from 'react-redux'
import { ContextChip } from '../../components/ContextChip'
import { useEffect, useState } from 'react'
import { setHoveredAnnotation, setSelectedAnnotation } from '../../services/globals'

export const Project = ({ projectIri }) => {
  const [isOpen, setIsOpen] = useState(true)
  const { data: analyticalProject } = useGetAnalyticalProjectQuery(projectIri)
  const { annotations, selectedAnnotation } = useSelector(state => state.globals)
  const [annotationsByPage, setAnnotationsByPage] = useState([])
  const dispatch = useDispatch()

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
          <ListItemText primary={analyticalProject.label} secondary="Analytical project" />
        </ListItemButton>
      </ListItem>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {annotations.length ? (
          Object.entries(annotationsByPage).map(([page, pageAnnotations]) => (
            <TimelineItem key={page} sx={{ '& .MuiTimelineItem-root': { bgcolor: 'red' } }}>
              <Typography padding={1.5} noWrap fontSize={10}>
                Page {page}
              </Typography>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <Stack flex={10000}>
                {pageAnnotations.map(annotation => (
                  <ListItem
                    key={annotation.date}
                    disablePadding
                    onClick={() =>
                      dispatch(setSelectedAnnotation(selectedAnnotation !== annotation ? annotation.date : null))
                    }
                    secondaryAction={
                      <IconButton edge="end">
                        <Comment />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      selected={selectedAnnotation === annotation}
                      onMouseEnter={() => dispatch(setHoveredAnnotation(annotation))}
                      onMouseLeave={() => dispatch(setHoveredAnnotation())}
                    >
                      {annotation.concepts.map(concept => (
                        <ContextChip key={concept} primary={concept} secondary="Praetorius" sx={{ m: 0.2 }} />
                      ))}
                    </ListItemButton>
                  </ListItem>
                ))}
              </Stack>
            </TimelineItem>
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
