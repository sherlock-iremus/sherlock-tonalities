import { HistoryEdu } from '@mui/icons-material'
import { Avatar, Button, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { Stack } from '@mui/system'
import { Concepts } from './Concepts'
import { ContextMenu } from './ContextMenu'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from '../../components/Input'
import { setSelectedConcepts } from '../../services/globals'
import { useGetModelsQuery } from '../../services/models'

export const Model = () => {
  const dispatch = useDispatch()
  const { data: models } = useGetModelsQuery()
  const [filter, setFilter] = useState('')
  const [contextMenu, setContextMenu] = useState(false)
  const { selectedModelIndex, selectedConcepts, selectedAnnotation } = useSelector(state => state.globals)

  if (!models) return null
  const { data } = models[selectedModelIndex]
  
  return (
    <Stack borderRadius={3} bgcolor="white" boxShadow={1} minHeight={0}>
      <ContextMenu {...{ contextMenu, setContextMenu }} />
      <ListItem
        dense
        secondaryAction={
          <Button
            size="small"
            onClick={event =>
              setContextMenu(!contextMenu ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null)
            }
          >
            change
          </Button>
        }
      >
        <ListItemIcon>
          <Avatar sx={{ fontSize: 12, height: 32, width: 32, marginLeft: 1 }}>
            {models[selectedModelIndex].name.charAt(0)}
          </Avatar>
        </ListItemIcon>
        <ListItemText primary={models[selectedModelIndex].name} secondary="Selected model" />
      </ListItem>
      <Input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search..." />
      <Stack direction="row" justifyContent="space-between" alignItems="center" pr={2}>
        <ListSubheader disableSticky>Available concepts</ListSubheader>
        {!selectedConcepts.length ? (
          <Button
            size="small"
            onClick={() => dispatch(setSelectedConcepts(data.map(e => e.iri)))}
            disabled={!!selectedAnnotation}
          >
            Select all
          </Button>
        ) : (
          <Button onClick={() => dispatch(setSelectedConcepts())} size="small">
            Clear filter
          </Button>
        )}
      </Stack>
      <Concepts {...{ data, filter }} />
    </Stack>
  )
}
