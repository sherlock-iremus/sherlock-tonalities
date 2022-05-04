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
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usePrevious } from '../meiviewer/utils'
import { setInspectedAnnotation, setInspectedConcept, setInspectedNote } from '../slice/scoreSlice'
import { AnnotationEntity } from './inspector/AnnotationEntity'
import { ConceptEntity } from './inspector/ConceptEntity'
import { NoteEntity } from './inspector/NoteEntity'

export const Inspector = props => {
  const [header, setHeader] = useState({ label: '', icon: null })

  const { baseUrl, isInspectionMode, inspectedEntity } = useSelector(state => state.score)

  const previousEntity = usePrevious(inspectedEntity)

  const setToPreviousEntity = () => {
    if (previousEntity.noteIri) setInspectedNote(previousEntity.noteIri)
    else if (previousEntity.conceptIri) setInspectedConcept(previousEntity.conceptIri)
    else if (previousEntity.annotationIri) setInspectedAnnotation(previousEntity.annotationIri)
    else setInspectedNote(previousEntity)
  }

  useEffect(() => {
    if (inspectedEntity.noteIri) setHeader({ label: 'Note', icon: <MusicNote /> })
    else if (inspectedEntity.verticalityIri) setHeader({ label: 'Verticality', icon: <AlignHorizontalCenter /> })
    else if (inspectedEntity.positionnedNoteIri) setHeader({ label: 'Positionned note', icon: <QueueMusic /> })
    else if (inspectedEntity.selectionIri) setHeader({ label: 'Selection', icon: <BubbleChart /> })
    else if (inspectedEntity.conceptIri) setHeader({ label: 'Theorical concept', icon: <HistoryEdu /> })
    else if (inspectedEntity.annotationIri) setHeader({ label: 'Analytical entity', icon: <Lyrics /> })
    else setHeader({ label: '', icon: null })
  }, [inspectedEntity])

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
              <IconButton
                onClick={setToPreviousEntity}
                disabled={!previousEntity?.noteIri && !previousEntity?.conceptIri && !previousEntity?.annotationIri}
                edge="start"
                color="inherit"
              >
                <ArrowBack />
              </IconButton>
              <Tabs value={0} textColor="inherit" indicatorColor="primary" centered sx={{ flexGrow: 1 }}>
                <Tab label={header.label} icon={header.icon} />
              </Tabs>
              <IconButton disabled color="inherit" edge="end">
                <ArrowForward />
              </IconButton>
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
          </List>
        </Box>
      )}
    </Drawer>
  )
}
