/** @jsxImportSource @emotion/react */

import {
  AccountBox,
  AlignHorizontalCenter,
  ArrowBack,
  ArrowForward,
  AudioFile,
  BubbleChart,
  Close,
  Comment,
  ContentCopy,
  HistoryEdu,
  Launch,
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
import { setToNextInspection, setToPreviousInspection } from '../../app/services/scoreSlice'
import { AnalyticalEntity } from './entities/AnalyticalEntity'
import { ConceptEntity } from './entities/ConceptEntity'
import { NoteEntity } from './entities/NoteEntity'
import { SelectionEntity } from './entities/SelectionEntity'
import { VerticalityEntity } from './entities/VerticalityEntity'
import { ScoreItem } from './items/ScoreItem'
import { findKey } from './utils'
import { COLOR_INSPECTED } from './mei.css'
import { AnnotationEntity } from './entities/AnnotationEntity'
import { PositionnedNoteEntity } from './entities/PositionnedNoteEntity'

export const Inspector = props => {
  const dispatch = useDispatch()
  const [isShowingPopup, setIsShowingPopup] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const { isInspectionMode, inspectedEntities, currentEntityIndex } = useSelector(state => state.score)

  const copyToClipboard = async value => {
    await navigator.clipboard.writeText(value)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const currentEntity = inspectedEntities[currentEntityIndex]
  const previousEntity = inspectedEntities[currentEntityIndex - 1] || {}
  const nextEntity = inspectedEntities[currentEntityIndex + 1] || {}

  const {
    noteIri,
    verticalityIri,
    positionnedNoteIri,
    selectionIri,
    conceptIri,
    annotationIri,
    scoreIri,
    analyticalEntityIri,
    contributorIri,
    attachedNoteIri,
    clickedNoteIri,
  } = currentEntity

  useEffect(() => findKey(currentEntity) && !props.isOpen && setIsShowingPopup(true), [inspectedEntities])

  return (
    <>
      <Drawer open={props.isOpen} anchor="right" variant="persistent">
        {isInspectionMode && (
          <Box sx={{ width: 400 }}>
            <AppBar position="sticky" sx={{ bgcolor: COLOR_INSPECTED }}>
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
                    disabled={
                      !previousEntity.noteIri &&
                      !previousEntity.verticalityIri &&
                      !previousEntity.positionnedNoteIri &&
                      !previousEntity.selectionIri &&
                      !previousEntity.conceptIri &&
                      !previousEntity.annotationIri &&
                      !previousEntity.analyticalEntityIri &&
                      !previousEntity.contributorIri &&
                      !previousEntity.scoreIri
                    }
                    edge="start"
                    color="inherit"
                  >
                    <ArrowBack />
                  </IconButton>
                )}
                {nextEntity && (
                  <IconButton
                    onClick={() => dispatch(setToNextInspection())}
                    disabled={
                      !nextEntity.noteIri &&
                      !nextEntity.verticalityIri &&
                      !nextEntity.positionnedNoteIri &&
                      !nextEntity.selectionIri &&
                      !nextEntity.conceptIri &&
                      !nextEntity.annotationIri &&
                      !nextEntity.analyticalEntityIri &&
                      !nextEntity.contributorIri &&
                      !nextEntity.scoreIri
                    }
                    color="inherit"
                  >
                    <ArrowForward />
                  </IconButton>
                )}
                <Tabs
                  value={0}
                  textColor="inherit"
                  centered
                  sx={{ flexGrow: 1, '& .MuiTabs-indicator': { backgroundColor: COLOR_INSPECTED } }}
                >
                  <Tab
                    label={
                      (noteIri && 'Note') ||
                      (verticalityIri && 'Verticality') ||
                      (positionnedNoteIri && 'Positionned note') ||
                      (selectionIri && 'Selection') ||
                      (conceptIri && 'Concept') ||
                      (annotationIri && 'Annotation') ||
                      (analyticalEntityIri && 'Analytical entity') ||
                      (contributorIri && 'Contributor') ||
                      (scoreIri && 'Score')
                    }
                    icon={
                      (noteIri && <MusicNote />) ||
                      (verticalityIri && <AlignHorizontalCenter />) ||
                      (positionnedNoteIri && <QueueMusic />) ||
                      (selectionIri && <BubbleChart />) ||
                      (conceptIri && <HistoryEdu />) ||
                      (annotationIri && <Comment />) ||
                      (analyticalEntityIri && <Lyrics />) ||
                      (contributorIri && <AccountBox />) ||
                      (scoreIri && <AudioFile />)
                    }
                  />
                </Tabs>
                <Tooltip title={isCopied ? 'Copied !' : 'Copy element IRI'}>
                  <span>
                    <IconButton
                      disabled={!findKey(currentEntity)}
                      onClick={() => copyToClipboard(findKey(currentEntity))}
                      color="inherit"
                    >
                      <ContentCopy />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Open element in Sherlock">
                  <span>
                    <IconButton
                      disabled={!findKey(currentEntity)}
                      href={findKey(currentEntity)}
                      edge="end"
                      color="inherit"
                      target="_blank"
                    >
                      <Launch />
                    </IconButton>
                  </span>
                </Tooltip>
              </Toolbar>
            </AppBar>
            <List>
              {noteIri && <NoteEntity {...{ noteIri }} />}
              {analyticalEntityIri && <AnalyticalEntity {...{ analyticalEntityIri, scoreIri }} />}
              {positionnedNoteIri && <PositionnedNoteEntity {...{ positionnedNoteIri, attachedNoteIri }} isEntity />}
              {conceptIri && <ConceptEntity {...{ conceptIri }} />}
              {selectionIri && <SelectionEntity {...{ selectionIri }} />}
              {verticalityIri && <VerticalityEntity {...{ verticalityIri, clickedNoteIri }} />}
              {scoreIri && <ScoreItem />}
              {annotationIri && <AnnotationEntity {...{ annotationIri }} />}
            </List>
          </Box>
        )}
      </Drawer>
      <Snackbar
        open={isShowingPopup && !props.isOpen}
        autoHideDuration={3000}
        onClose={() => setIsShowingPopup(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mr: 8, mt: 1 }}
      >
        <Alert variant="filled" severity="info" onClose={() => setIsShowingPopup(false)}>
          <Link onClick={props.onChange} underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
            {(noteIri && 'A note entity has been selected, click to view inspection') ||
              (verticalityIri && 'A verticality has been selected, click to view inspection') ||
              (conceptIri && 'A concept entity has been selected, click to view inspection') ||
              (selectionIri && 'A selection entity has been selected, click to view inspection') ||
              (annotationIri && 'An annalytical entity has been selected, click to view inspection')}
          </Link>
        </Alert>
      </Snackbar>
    </>
  )
}
