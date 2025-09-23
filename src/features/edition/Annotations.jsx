import { TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab'
import { Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Annotation } from './Annotation'
import { DndContext, DragOverlay } from '@dnd-kit/core'

export const Annotations = ({ annotations, annotationsByPage, scrollPosition, setScrollPosition, expandAll }) => {
  const ref = useRef()
  const setScroll = div => (div.onscroll = () => setScrollPosition(div.scrollTop))

  const [draggedId, setDraggedId] = useState(null)
  const onDragStart = event => setDraggedId(event.active.id)
  const onDragEnd = event => setDraggedId(null)

  useEffect(() => {
    const div = ref.current
    div.scrollTop = scrollPosition
    window.addEventListener('scroll', setScroll(div))
    return () => window.removeEventListener('scroll', setScroll(div))
  }, [])

  return (
    <Stack {...{ ref }} overflow="auto">
      <DndContext {...{ onDragStart, onDragEnd }}>
        {/* <DragOverlay>{draggedId ? <Annotation key={draggedId} expandAll={false} /> : null}</DragOverlay> */}
        <DragOverlay>
          <h1>coucou</h1>
        </DragOverlay>
        {annotations.length ? (
          Object.entries(annotationsByPage).map(
            ([page, pageAnnotations]) =>
              pageAnnotations.length && (
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
                      <Annotation key={annotation.annotation} {...annotation} {...{ expandAll }} color />
                    ))}
                  </Stack>
                </Stack>
              )
          )
        ) : (
          <Stack flex={1} justifyContent="center" paddingY={4}>
            <Typography textAlign="center" color="text.secondary" fontSize={14} padding={2}>
              No created annotation, start by selecting score items and assigning them concepts
            </Typography>
          </Stack>
        )}
      </DndContext>
    </Stack>
  )
}
