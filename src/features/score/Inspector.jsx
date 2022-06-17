/** @jsxImportSource @emotion/react */

import {
  AlignHorizontalCenter,
  ArrowBack,
  ArrowForward,
  AudioFile,
  BubbleChart,
  Close,
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
import { blue } from '@mui/material/colors'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setToNextInspection, setToPreviousInspection } from '../../app/services/scoreSlice'
import { AnnotationEntity } from './entities/AnnotationEntity'
import { ConceptEntity } from './entities/ConceptEntity'
import { NoteEntity } from './entities/NoteEntity'
import { SelectionEntity } from './entities/SelectionEntity'
import { VerticalityEntity } from './entities/VerticalityEntity'
import { PositionnedNoteItem } from './items/PositionnedNoteItem'
import { ScoreItem } from './items/ScoreItem'
import { findKey } from './utils'

export const Inspector = props => {
  const dispatch = useDispatch()
  const [isShowingPopup, setIsShowingPopup] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const { baseUrl, isInspectionMode, inspectedEntities, currentEntityIndex } = useSelector(state => state.score)

  const copyToClipboard = async value => {
    await navigator.clipboard.writeText(value)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000);
  }

  const {
    noteIri,
    verticalityIri,
    positionnedNoteIri,
    selectionIri,
    conceptIri,
    annotationIri,
    scoreIri,
    attachedNoteIri,
    clickedNoteIri,
  } = inspectedEntities[currentEntityIndex]

  const previousEntity = inspectedEntities[currentEntityIndex - 1] || {}
  const nextEntity = inspectedEntities[currentEntityIndex + 1] || {}
  useEffect(
    () => findKey(inspectedEntities[currentEntityIndex]) && !props.isOpen && setIsShowingPopup(true),
    [inspectedEntities]
  )

  return (
    <>
      <Drawer open={props.isOpen} anchor="right" variant="persistent">
        {isInspectionMode && (
          <Box sx={{ width: 400 }}>
            <AppBar position="sticky" sx={{ bgcolor: blue[800] }}>
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
                  sx={{ flexGrow: 1, pr: 4, '& .MuiTabs-indicator': { backgroundColor: blue[800] } }}
                >
                  <Tab
                    label={
                      (noteIri && 'Note') ||
                      (verticalityIri && 'Verticality') ||
                      (positionnedNoteIri && 'Positionned note') ||
                      (selectionIri && 'Selection') ||
                      (conceptIri && 'Concept') ||
                      (annotationIri && 'Annalytical entity') ||
                      (scoreIri && 'Score')
                    }
                    icon={
                      (noteIri && <MusicNote />) ||
                      (verticalityIri && <AlignHorizontalCenter />) ||
                      (positionnedNoteIri && <QueueMusic />) ||
                      (selectionIri && <BubbleChart />) ||
                      (conceptIri && <HistoryEdu />) ||
                      (annotationIri && <Lyrics />) ||
                      (scoreIri && <AudioFile />)
                    }
                  />
                </Tabs>
                <Tooltip title={isCopied ? 'Copied !' : 'Copy element IRI'}>
                  <span>
                    <IconButton
                      disabled={!findKey(inspectedEntities[currentEntityIndex])}
                      onClick={() => copyToClipboard(findKey(inspectedEntities[currentEntityIndex]))}
                      color="inherit"
                    >
                      <ContentCopy />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Open element in Sherlock">
                  <span>
                    <IconButton
                      disabled={!findKey(inspectedEntities[currentEntityIndex])}
                      href={findKey(inspectedEntities[currentEntityIndex])}
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
              {noteIri && <NoteEntity noteIri={noteIri} baseUrl={baseUrl} />}
              {annotationIri && (
                <AnnotationEntity annotationIri={annotationIri} scoreIri={props.scoreIri} baseUrl={baseUrl} />
              )}
              {positionnedNoteIri && (
                <PositionnedNoteItem
                  isEntity
                  positionnedNoteIri={positionnedNoteIri}
                  attachedNoteIri={attachedNoteIri}
                  baseUrl={baseUrl}
                />
              )}
              {conceptIri && <ConceptEntity conceptIri={conceptIri} baseUrl={baseUrl} />}
              {selectionIri && <SelectionEntity selectionIri={selectionIri} baseUrl={baseUrl} />}
              {verticalityIri && (
                <VerticalityEntity verticalityIri={verticalityIri} clickedNoteIri={clickedNoteIri} baseUrl={baseUrl} />
              )}
              {scoreIri && <ScoreItem {...{ scoreIri }} />}
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
