import { Menu } from '../../components/Menu'
import { Concepts } from '../navigator/Concepts'

export const ContextMenu = ({ contextMenu, setContextMenu }) => (
  <Menu
    open={!!contextMenu}
    onClose={() => setContextMenu(null)}
    anchorReference="anchorPosition"
    anchorPosition={contextMenu && { top: contextMenu.mouseY, left: contextMenu.mouseX }}
  >
    <Concepts/>
  </Menu>
)
