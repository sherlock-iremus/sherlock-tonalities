import { TimelineDot, TimelineSeparator, TimelineConnector } from '@mui/lab'
import { Button, ListSubheader, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Annotation } from './Annotation'

export const Annotations = ({ annotations, annotationsByPage, scrollPosition, setScrollPosition }) => {
  const ref = useRef()

  const [expandAll, setExpandAll] = useState(true)
  const setScroll = div => (div.onscroll = () => setScrollPosition(div.scrollTop))

  useEffect(() => {
    const div = ref.current
    div.scrollTop = scrollPosition
    window.addEventListener('scroll', setScroll(div))
    return () => window.removeEventListener('scroll', setScroll(div))
  }, [])

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center" pr={2}>
        <ListSubheader disableSticky>Annotations</ListSubheader>
        <Button size="small" onClick={() => setExpandAll(!expandAll)}>
          {expandAll ? 'shrink all' : 'expand all'}
        </Button>
      </Stack>
      <Stack {...{ ref }} overflow="auto">
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
      </Stack>
    </Stack>
  )
}
