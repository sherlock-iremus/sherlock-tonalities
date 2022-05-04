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
import { ANNOTATION, CONCEPT, NOTE, POSITIONNED_NOTE, VERTICALITY } from '../meiviewer/constants'
import { AnnotationEntity } from './inspector/AnnotationEntity'
import { ConceptEntity } from './inspector/ConceptEntity'
import { NoteEntity } from './inspector/NoteEntity'

export const Inspector = props => {
  const dispatch = useDispatch()

  const entityTypes = {
    NOTE: { label: 'Note', icon: <MusicNote /> },
    VERTICALITY: { label: 'Verticality', icon: <AlignHorizontalCenter /> },
    POSITIONNED_NOTE: { label: 'Positionned note', icon: <QueueMusic /> },
    SELECTION: { label: 'Selection', icon: <BubbleChart /> },
    CONCEPT: { label: 'Theorical concept', icon: <HistoryEdu /> },
    ANNOTATION: { label: 'Analytical entity', icon: <Lyrics /> },
  }

  const {
    baseUrl,
    isInspectionMode,
    inspectedEntity
  } = useSelector(state => state.score)

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
                  label={inspectedEntity.id ? entityTypes[inspectedEntity.type].label : ''}
                  icon={inspectedEntity.id ? entityTypes[inspectedEntity.type].icon : null}
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
            {inspectedEntity.type === NOTE && <NoteEntity noteIri={inspectedEntity.id} baseUrl={baseUrl} />}
            {inspectedEntity.type === ANNOTATION && <AnnotationEntity annotationIri={inspectedEntity.id} scoreIri={props.scoreIri} treatiseIri={props.treatiseIri} baseUrl={baseUrl} />}
            {inspectedEntity.type === CONCEPT && <ConceptEntity conceptIri={inspectedEntity.id} treatiseIri={props.treatiseIri} baseUrl={baseUrl} />}
          </List>
        </Box>
      )}
    </Drawer>
  )
}
