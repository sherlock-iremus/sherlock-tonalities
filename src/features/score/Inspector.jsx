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
import {
  Alert,
  AppBar,
  Drawer,
  IconButton,
  Link,
  List,
  Snackbar,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setToNextInspection, setToPreviousInspection } from '../slice/scoreSlice'
import { AnnotationEntity } from './entities/AnnotationEntity'
import { ConceptEntity } from './entities/ConceptEntity'
import { NoteEntity } from './entities/NoteEntity'
import { SelectionEntity } from './entities/SelectionEntity'
import { VerticalityEntity } from './entities/VerticalityEntity'

export const Inspector = props => {
  const dispatch = useDispatch()
  const [isShowingPopup, setIsShowingPopup] = useState(false)

  const { baseUrl, isInspectionMode, inspectedEntities, currentEntityIndex } = useSelector(state => state.score)

  const inspectedEntity = inspectedEntities[currentEntityIndex]
  const previousEntity = inspectedEntities[currentEntityIndex - 1] || inspectedEntities[0]
  const nextEntity = inspectedEntities[currentEntityIndex + 1] || inspectedEntities[0]
  useEffect(
    () =>
      (inspectedEntity.noteIri ||
        inspectedEntity.verticalityIri ||
        inspectedEntity.conceptIri ||
        inspectedEntity.selectionIri ||
        inspectedEntity.annotationIri) &&
      !props.isOpen &&
      setIsShowingPopup(true),
    [inspectedEntity]
  )

  return (
    <>
      <Drawer open={props.isOpen} anchor="right" variant="persistent">
        {isInspectionMode && (
          <Box sx={{ width: 400 }}>
            <AppBar position="sticky">
              <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Inspector
                </Typography>
                <Tooltip title="Close">
                  <IconButton edge="end" color="inherit" onClick={props.onChange}>
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
                <Tabs value={0} textColor="inherit" indicatorColor="primary" centered sx={{ flexGrow: 1, pr: 4 }}>
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
                <ConceptEntity conceptIri={inspectedEntity.conceptIri} baseUrl={baseUrl} />
              )}
              {inspectedEntity.selectionIri && (
                <SelectionEntity selectionIri={inspectedEntity.selectionIri} baseUrl={baseUrl} />
              )}
              {inspectedEntity.verticalityIri && (
                <VerticalityEntity verticalityIri={inspectedEntity.verticalityIri} baseUrl={baseUrl} />
              )}
            </List>
          </Box>
        )}
      </Drawer>
      <Snackbar
        open={isShowingPopup && !props.isOpen}
        autoHideDuration={2000}
        onClose={() => setIsShowingPopup(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 10 }}
      >
        <Alert variant="filled" severity="info" onClose={() => setIsShowingPopup(false)}>
          <Link onClick={props.onChange} underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
            {(inspectedEntity.noteIri && 'A note entity has been selected, click to view inspection') ||
              (inspectedEntity.verticalityIri && 'A verticality has been selected, click to view inspection') ||
              (inspectedEntity.conceptIri && 'A concept entity has been selected, click to view inspection') ||
              (inspectedEntity.selectionIri && 'A selection entity has been selected, click to view inspection') ||
              (inspectedEntity.annotationIri && 'An annalytical entity has been selected, click to view inspection')}
          </Link>
        </Alert>
      </Snackbar>
    </>
  )
}
