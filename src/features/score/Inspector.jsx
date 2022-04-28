/** @jsxImportSource @emotion/react */

import { MusicNote } from '@mui/icons-material'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { Box } from '@mui/system'
import { useSelector } from 'react-redux'
import { useGetNoteInfoQuery } from '../../app/services/sparql'

export const Inspector = props => {
  const isInspectionMode = useSelector(state => state.inspectedEntity.isInspectionMode)

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
        <Box sx={{ width: 300 }}>
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
                  <ListItemText primary={noteLabel} secondary={inspectedEntity.id} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      )}
    </Drawer>
  )
}
