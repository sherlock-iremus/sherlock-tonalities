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
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUuid } from '../utils'
import { usePostAnalyticalProjectMutation } from '../app/services/sherlockApi'

export const NewProject = ({ isOpen, setIsOpen, score }) => {
  const navigate = useNavigate()
  const [label, setLabel] = useState('')
  const [postAnalyticalProject, { isLoading }] = usePostAnalyticalProjectMutation()

  const createAnalyticalProject = async () => {
    if (label.length && !isLoading)
      try {
        const response = await postAnalyticalProject({ label }).unwrap()
        const project = response.find(e => e['@type'].includes('http://www.cidoc-crm.org/cidoc-crm/E7_Activity'))
        const projectId = getUuid(project['@id'])
        const scoreId = getUuid(score.scoreIri)
        navigate(`/project/${projectId}/score/${scoreId}`)
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>Create analytical project?</DialogTitle>
      <DialogContent>
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
      <ListSubheader>Selected score</ListSubheader>
        <ListItemButton selected disableRipple disablePadding>
          <ListItemIcon>
            <AudioFile />
          </ListItemIcon>
          <ListItemText primary={score.scoreTitle} secondary="Composer" />
        </ListItemButton>
      <DialogActions>
        <Button color="text" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button disabled={!label} onClick={createAnalyticalProject}>
          Create project
        </Button>
      </DialogActions>
    </Dialog>
  )
}
