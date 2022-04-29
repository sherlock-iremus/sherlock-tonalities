/** @jsxImportSource @emotion/react */

import { Close } from '@mui/icons-material'
import { AppBar, Drawer, IconButton, List, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { ConceptNode } from './ConceptNode'
import { NoteNode } from './NoteNode'

export const Inspector = props => {
  const isInspectionMode = useSelector(state => state.inspectedEntity.isInspectionMode)

  const dispatch = useDispatch()

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
          </AppBar>
          <List sx={{ overflow: 'auto' }}>
            {inspectedNoteId && <NoteNode note={inspectedNoteId} />}
            {inspectedConceptId && <ConceptNode concept={inspectedConceptId} treatiseIri={props.treatiseIri} />}
          </List>
        </Box>
      )}
    </Drawer>
  )
}
