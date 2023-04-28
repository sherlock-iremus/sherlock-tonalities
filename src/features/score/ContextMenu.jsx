import { Menu } from '../../components/Menu'
import { List, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { setSelectedModelIndex } from '../../services/globals'
import { useDispatch, useSelector } from 'react-redux'
import models from '../../config/models.json'

export const ContextMenu = ({ contextMenu, setContextMenu }) => {
  const dispatch = useDispatch()
  const { selectedModelIndex } = useSelector(state => state.globals)

  return (
    <Menu
      open={!!contextMenu}
      onClose={() => setContextMenu(null)}
      anchorReference="anchorPosition"
      {...(contextMenu && { anchorPosition: { top: contextMenu.mouseY, left: contextMenu.mouseX } })}
    >
      <List subheader={<ListSubheader>Available models</ListSubheader>} dense disablePadding>
        {models.map((model, index) => (
          <ListItemButton
            key={model.baseIri}
            onClick={() => dispatch(setSelectedModelIndex(index)) && setContextMenu(null)}
            disabled={index === selectedModelIndex}
          >
            <ListItemText primary={model.name} />
          </ListItemButton>
        ))}
      </List>
    </Menu>
  )
}
