/** @jsxImportSource @emotion/react */

import {
  AlignHorizontalCenter,
  ArrowBack,
  ArrowForward,
  BubbleChart,
  Close,
  HistoryEdu,
  Lyrics,
  MusicNote,
  QueueMusic,
} from '@mui/icons-material'
import { AppBar, Drawer, IconButton, List, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { AnnotationEntity } from './inspector/AnnotationEntity'
import { ConceptEntity } from './inspector/ConceptEntity'
import { NoteEntity } from './inspector/NoteEntity'

export const Inspector = props => {
  const dispatch = useDispatch()

  const entityTypes = [
    { label: 'Note', icon: <MusicNote /> },
    { label: 'Verticality', icon: <AlignHorizontalCenter /> },
    { label: 'Positionned note', icon: <QueueMusic /> },
    { label: 'Selection', icon: <BubbleChart /> },
    { label: 'Theorical concept', icon: <HistoryEdu /> },
    { label: 'Analytical entity', icon: <Lyrics /> },
  ]

  const {
    baseUrl,
    isInspectionMode,
    inspectedNoteId,
    inspectedVerticalityId,
    inspectedPositionnedNoteId,
    inspectedSelectionId,
    inspectedConceptId,
    inspectedAnnotationId
  } = useSelector(state => state.inspectedEntity)

  return (
    <Drawer open={props.isOpen} anchor="right" variant="persistent">
      {isInspectionMode && (
        <Box sx={{ width: 400 }}>
          <AppBar position="sticky">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Inspector
              </Typography>
              <Tooltip title="Close">
                <IconButton edge="end" color="inherit" onClick={props.onClose}>
                  <Close />
                </IconButton>
              </Tooltip>
            </Toolbar>
            <Toolbar>
              <Tooltip title="Go backward">
                <IconButton edge="start" color='inherit'>
                  <ArrowBack />
                </IconButton>
              </Tooltip>
              <Tabs value={0} textColor="inherit" indicatorColor="primary" centered sx={{ flexGrow: 1 }}>
                <Tab
                  label={(inspectedNoteId && entityTypes[0].label) || (inspectedConceptId && entityTypes[4].label) || (inspectedAnnotationId && entityTypes[5].label)}
                  icon={(inspectedNoteId && entityTypes[0].icon) || (inspectedConceptId && entityTypes[4].icon) || (inspectedAnnotationId && entityTypes[5].icon)}
                />
              </Tabs>
              <Tooltip title="Go forward">
                <IconButton color='inherit' edge="end">
                  <ArrowForward />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <List>
            {inspectedNoteId && <NoteEntity note={inspectedNoteId} baseUrl={baseUrl} />}
            {inspectedAnnotationId && <AnnotationEntity annotation={inspectedAnnotationId} scoreIri={props.scoreIri} treatiseIri={props.treatiseIri} baseUrl={baseUrl} />}
            {inspectedConceptId && <ConceptEntity concept={inspectedConceptId} treatiseIri={props.treatiseIri} baseUrl={baseUrl} />}
          </List>
        </Box>
      )}
    </Drawer>
  )
}
