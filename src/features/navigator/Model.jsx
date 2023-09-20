import { HistoryEdu } from '@mui/icons-material'
import { Button, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { Stack } from '@mui/system'
import { Concepts } from './Concepts'
import { ContextMenu } from './ContextMenu'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import models from '../../config/models.json'
import { Input } from '../../components/Input'
import { useGetModelQuery } from '../../services/model'
import { setSelectedConcepts } from '../../services/globals'

export const Model = () => {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('')
  const [contextMenu, setContextMenu] = useState(false)
  const { selectedModelIndex, selectedConcepts, selectedAnnotation } = useSelector(state => state.globals)
  const { data } = useGetModelQuery(selectedModelIndex)

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
          <HistoryEdu />
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
