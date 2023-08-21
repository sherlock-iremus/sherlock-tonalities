import { AudioFile } from '@mui/icons-material'
import {
  Button,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
  Tooltip,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUuid, getUuid } from '../utils'
import { usePostAnalyticalProjectMutation } from '../services/service'

export const NewProject = ({ isOpen, setIsOpen, score, upload }) => {
  const navigate = useNavigate()
  const [label, setLabel] = useState('')
  const [postAnalyticalProject, { isLoading }] = usePostAnalyticalProjectMutation()

  const createAnalyticalProject = async () => {
    if (label.length && !isLoading)
      try {
        const response = await postAnalyticalProject({ label }).unwrap()
        const project = response.find(e => e['@type'].includes('http://www.cidoc-crm.org/cidoc-crm/E7_Activity'))
        const projectId = getUuid(project['@id'])
        const scoreId = score ? getUuid(score.scoreIri) : createUuid()
        navigate(`/project/${projectId}/score/${scoreId}`, { state: { upload } })
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>Create analytical project?</DialogTitle>
      <DialogContent sx={{ paddingX: 2, paddingY: 0 }}>
        <TextField
          value={label}
          onChange={event => setLabel(capitalize(event.target.value))}
          autoFocus
          margin="dense"
          label="New project label"
          fullWidth
          onKeyDown={e => e.key === 'Enter' && label && createAnalyticalProject()}
        />
      </DialogContent>
      <ListSubheader disableSticky>Start working on</ListSubheader>
      <ListItemButton selected disableRipple dense>
        <ListItemIcon>
          <AudioFile />
        </ListItemIcon>
        <ListItemText primary={score.scoreTitle} secondary="Composer" />
      </ListItemButton>
      <DialogActions sx={{ paddingTop: 2 }}>
        <Tooltip title="Hit Enter key">
          <Button disabled={!label} onClick={createAnalyticalProject}>
            Create project
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  )
}
