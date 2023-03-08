import { AudioFile } from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material'
import scores from '../app/scores.json'
import { useNavigate } from 'react-router-dom'
import { getUuidFromSherlockIri } from '../utils'

export const ScoreLibrary = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate()

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>New analytical project</DialogTitle>
      <List subheader={<ListSubheader>Select a score</ListSubheader>} dense disablePadding sx={{ overflow: 'auto' }}>
        {scores.map(score => (
          <ListItem key={score.scoreIri} disablePadding>
            <ListItemButton onClick={() => navigate(`/score/${getUuidFromSherlockIri(score.scoreIri)}`)}>
              <ListItemIcon>
                <AudioFile />
              </ListItemIcon>
              <ListItemText primary={score.scoreTitle} secondary="Composer" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}
