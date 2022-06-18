import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { HistoryEdu } from '@mui/icons-material'
import { treatiseList } from '../../app/treatises/treatises'

export const TretiseLibrary = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.tonalityBaseUrl.length)
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <Typography gutterBottom variant="h5" component="div">
          Historical treatises
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </Typography>
      </DialogContent>
      <List subheader={<ListSubheader>Available musical treatises</ListSubheader>} dense disablePadding>
        {treatiseList.map(iri => (
          <ListItem key={iri} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Avatar>
                  <HistoryEdu />
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={iri.slice(baseUrlLength)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button size="small">Select treaty</Button>
      </DialogActions>
    </Dialog>
  )
}
