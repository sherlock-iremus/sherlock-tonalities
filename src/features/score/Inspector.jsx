/** @jsxImportSource @emotion/react */

import {
  AlignHorizontalCenter,
  ArrowBack,
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
import { setInspectedAnnotation, setInspectedConcept, setInspectedNote, setInspectedSelection } from '../slice/scoreSlice'
import { AnnotationEntity } from './inspector/AnnotationEntity'
import { ConceptEntity } from './inspector/ConceptEntity'
import { NoteEntity } from './inspector/NoteEntity'
import { SelectionEntity } from './inspector/SelectionEntity'

export const Inspector = props => {
  const dispatch = useDispatch()

  const { baseUrl, isInspectionMode, inspectedEntity } = useSelector(state => state.score)

  const previousEntity = usePrevious(inspectedEntity)

  const setToPreviousEntity = () => {
    if (previousEntity.noteIri) dispatch(setInspectedNote(previousEntity.noteIri))
    else if (previousEntity.conceptIri) dispatch(setInspectedConcept(previousEntity.conceptIri))
    else if (previousEntity.annotationIri) dispatch(setInspectedAnnotation(previousEntity.annotationIri))
    else if (previousEntity.selectionIri) dispatch(setInspectedSelection(previousEntity.selectionIri))
  }

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
                  onClick={setToPreviousEntity}
                  disabled={!previousEntity.noteIri && !previousEntity.conceptIri && !previousEntity.annotationIri}
                  edge="start"
                  color="inherit"
                >
                  <ArrowBack />
                </IconButton>
              )}
              <Tabs value={0} textColor="inherit" indicatorColor="primary" centered sx={{ flexGrow: 1 }}>
                <Tab
                  label={
                    (inspectedEntity.noteIri && 'Note') ||
                    (inspectedEntity.verticalityIri && 'Verticality') ||
                    (inspectedEntity.positionnedNoteIri && 'Positionned note') ||
                    (inspectedEntity.selectionIri && 'Selection') ||
                    (inspectedEntity.conceptIri && 'Concept') ||
                    (inspectedEntity.annotationIri && 'Annotation')
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
                treatiseIri={props.treatiseIri}
                baseUrl={baseUrl}
              />
            )}
            {inspectedEntity.conceptIri && (
              <ConceptEntity
                conceptIri={inspectedEntity.conceptIri}
                treatiseIri={props.treatiseIri}
                baseUrl={baseUrl}
              />
            )}
            {inspectedEntity.selectionIri && (
              <SelectionEntity
                selectionIri={inspectedEntity.selectionIri}
                treatiseIri={props.treatiseIri}
                baseUrl={baseUrl}
              />
            )}
          </List>
        </Box>
      )}
    </Drawer>
  )
}
