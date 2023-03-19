import { AudioFile } from '@mui/icons-material'
import {
  Button,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUuidFromSherlockIri } from '../utils'

export const NewProject = ({ isOpen, setIsOpen, score }) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>Create analytical project?</DialogTitle>
      <DialogContent>
        <TextField
          value={name}
          onChange={event => setName(capitalize(event.target.value))}
          autoFocus
          margin="dense"
          label="New project name"
          fullWidth
        />
      </DialogContent>
      <ListSubheader>Selected score</ListSubheader>
      <ListItem disablePadding>
        <ListItemButton selected disableRipple>
          <ListItemIcon>
            <AudioFile />
          </ListItemIcon>
          <ListItemText primary={score.scoreTitle} secondary="Composer" />
        </ListItemButton>
      </ListItem>
      <DialogActions>
        <Button color="text" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button disabled={!name} onClick={() => navigate(`/score/${getUuidFromSherlockIri(score.scoreIri)}`)}>
          Create project
        </Button>
      </DialogActions>
    </Dialog>
  )
}
