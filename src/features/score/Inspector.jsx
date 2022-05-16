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
import { usePrevious } from '../meiviewer/utils'
import {
  setInspectedAnnotation,
  setInspectedConcept,
  setInspectedNote,
  setInspectedSelection,
  setPreviousInspection,
  setToNextInspection,
  setToPreviousInspection,
} from '../slice/scoreSlice'
import { AnnotationEntity } from './entities/AnnotationEntity'
import { ConceptEntity } from './entities/ConceptEntity'
import { NoteEntity } from './entities/NoteEntity'
import { SelectionEntity } from './entities/SelectionEntity'

export const Inspector = props => {
  const dispatch = useDispatch()

  const { baseUrl, isInspectionMode, inspectedEntities, currentEntityIndex } = useSelector(state => state.score)

  const inspectedEntity = inspectedEntities[currentEntityIndex]
  const previousEntity = inspectedEntities[currentEntityIndex - 1] || inspectedEntities[0]
  const nextEntity = inspectedEntities[currentEntityIndex + 1] || inspectedEntities[0]


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
              {previousEntity && (
                <IconButton
                  onClick={() => dispatch(setToPreviousInspection())}
                  disabled={!previousEntity.noteIri && !previousEntity.conceptIri && !previousEntity.annotationIri}
                  edge="start"
                  color="inherit"
                >
                  <ArrowBack />
                </IconButton>
              )}
              {nextEntity && (
                <IconButton
                  onClick={() => dispatch(setToNextInspection())}
                  disabled={!nextEntity.noteIri && !nextEntity.conceptIri && !nextEntity.annotationIri}
                  color="inherit"
                >
                  <ArrowForward />
                </IconButton>
              )}
              <Tabs value={0} textColor="inherit" indicatorColor="primary" centered sx={{ flexGrow: 1, pr:4 }}>
                <Tab
                  label={
                    (inspectedEntity.noteIri && 'Note') ||
                    (inspectedEntity.verticalityIri && 'Verticality') ||
                    (inspectedEntity.positionnedNoteIri && 'Positionned note') ||
                    (inspectedEntity.selectionIri && 'Selection') ||
                    (inspectedEntity.conceptIri && 'Concept') ||
                    (inspectedEntity.annotationIri && 'Annalytical entity')
                  }
                  icon={
                    (inspectedEntity.noteIri && <MusicNote />) ||
                    (inspectedEntity.verticalityIri && <AlignHorizontalCenter />) ||
                    (inspectedEntity.positionnedNoteIri && <QueueMusic />) ||
                    (inspectedEntity.selectionIri && <BubbleChart />) ||
                    (inspectedEntity.conceptIri && <HistoryEdu />) ||
                    (inspectedEntity.annotationIri && <Lyrics />)
                  }
                />
              </Tabs>
            </Toolbar>
          </AppBar>
          <List>
            {inspectedEntity.noteIri && <NoteEntity noteIri={inspectedEntity.noteIri} baseUrl={baseUrl} />}
            {inspectedEntity.annotationIri && (
              <AnnotationEntity
                annotationIri={inspectedEntity.annotationIri}
                scoreIri={props.scoreIri}
                baseUrl={baseUrl}
              />
            )}
            {inspectedEntity.conceptIri && (
              <ConceptEntity
                conceptIri={inspectedEntity.conceptIri}
                baseUrl={baseUrl}
              />
            )}
            {inspectedEntity.selectionIri && (
              <SelectionEntity
                selectionIri={inspectedEntity.selectionIri}
                baseUrl={baseUrl}
              />
            )}
          </List>
        </Box>
      )}
    </Drawer>
  )
}
