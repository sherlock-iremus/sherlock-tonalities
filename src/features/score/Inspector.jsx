/** @jsxImportSource @emotion/react */

import {
  AlignHorizontalCenter,
  BubbleChart,
  Close,
  HistoryEdu,
  Lyrics,
  MusicNote,
  QueueMusic,
} from '@mui/icons-material'
import { AppBar, Drawer, IconButton, List, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { ConceptNode } from './inspector/ConceptEntity'
import { NoteNode } from './inspector/NoteEntity'

export const Inspector = props => {
  const isInspectionMode = useSelector(state => state.inspectedEntity.isInspectionMode)

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
    inspectedNoteId,
    inspectedVerticalityId,
    inspectedPositionnedNoteId,
    inspectedSelectionId,
    inspectedConceptId,
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
              <IconButton edge="end" color="inherit" onClick={props.onClose}>
                <Close />
              </IconButton>
            </Toolbar>
            <Tabs value={0} textColor="inherit" indicatorColor="primary" centered>
              <Tab
                label={(inspectedNoteId && entityTypes[0].label) || (inspectedConceptId && entityTypes[4].label)}
                icon={(inspectedNoteId && entityTypes[0].icon) || (inspectedConceptId && entityTypes[4].icon)}
              />
            </Tabs>
          </AppBar>
          <List>
            {inspectedNoteId && <NoteNode note={inspectedNoteId} />}
            {inspectedConceptId && <ConceptNode concept={inspectedConceptId} treatiseIri={props.treatiseIri} />}
          </List>
        </Box>
      )}
    </Drawer>
  )
}
