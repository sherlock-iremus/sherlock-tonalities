import { Menu } from '../../components/Menu'
import { Concepts } from '../navigator/Concepts'
import { List, ListItemButton, ListItemText } from '@mui/material'

export const ContextMenu = ({ contextMenu, setContextMenu }) => (
  <Menu
    open={!!contextMenu}
    onClose={() => setContextMenu(null)}
    anchorReference="anchorPosition"
    anchorPosition={contextMenu && { top: contextMenu.mouseY, left: contextMenu.mouseX }}
  >
    <List dense disablePadding>
      <ListItemButton disabled>
        <ListItemText primary="Guillotel 2022" />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Praetorius 1619" />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Zarlino 1558" />
      </ListItemButton>
    </List>
  </Menu>
)
