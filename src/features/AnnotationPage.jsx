import { Close } from '@mui/icons-material'
import {
  AppBar,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'

export const AnnotationPage = ({ annotation, onClose }) => (
  <Slide direction="up" in={!!annotation} mountOnEnter unmountOnExit>
    <Stack overflow="auto">
      <AppBar sx={{ position: 'relative', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Analytical entity
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        <ListItemButton>
          <ListItemText primary="Phone ringtone" secondary="Titania" />
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText primary="Default notification ringtone" secondary="Tethys" />
        </ListItemButton>
      </List>
    </Stack>
  </Slide>
)
