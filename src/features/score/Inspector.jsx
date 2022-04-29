/** @jsxImportSource @emotion/react */

import { Close, MusicNote } from '@mui/icons-material'
import { AppBar, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteInfoQuery } from '../../app/services/sparql'
import { setInspectedNoteId } from '../inspection/inspectedEntitySlice'

export const Inspector = props => {
  const isInspectionMode = useSelector(state => state.inspectedEntity.isInspectionMode)

  const dispatch = useDispatch()

  const inspectedVerticalityId = useSelector(state => state.inspectedEntity.inspectedVerticalityId)
  const inspectedNoteId = useSelector(state => state.inspectedEntity.inspectedNoteId)
  const inspectedPositionnedNoteId = useSelector(state => state.inspectedEntity.inspectedPositionnedNoteId)
  const inspectedSelectionId = useSelector(state => state.inspectedEntity.inspectedSelectionId)
  const inspectedEntity =
    inspectedNoteId || inspectedPositionnedNoteId || inspectedSelectionId || inspectedVerticalityId

  const { data: noteLabel } = useGetNoteInfoQuery(inspectedEntity, { skip: !inspectedEntity })
  return (
    <Drawer open={!!inspectedEntity} anchor="right" variant="persistent">
      {isInspectionMode && (
        <Box sx={{ width: 400 }}>
          <AppBar position="sticky">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Inspector
              </Typography>
              <IconButton edge="end" color="inherit" onClick={() => dispatch(setInspectedNoteId(inspectedEntity))}>
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <List
            subheader={
              <ListSubheader>
                <b>Current inspection</b>
              </ListSubheader>
            }
            sx={{
              overflow: 'auto',
            }}
          >
            {noteLabel && (
              <ListItem disablePadding>
                <ListItemButton sx={{ cursor: 'default' }}>
                  <ListItemIcon>
                    <MusicNote />
                  </ListItemIcon>
                  <ListItemText primary={noteLabel} secondary={inspectedEntity} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      )}
    </Drawer>
  )
}
