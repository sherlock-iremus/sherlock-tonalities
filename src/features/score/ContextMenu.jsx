import { Menu } from '../../components/Menu'
import { List, ListItemButton, ListItemText } from '@mui/material'
import models from '../../app/models.json'
import { setSelectedModelIndex } from '../../app/services/scoreSlice'
import { useDispatch, useSelector } from 'react-redux'

export const ContextMenu = ({ contextMenu, setContextMenu }) => {
  const dispatch = useDispatch()
  const { selectedModelIndex } = useSelector(state => state.score)

  return (
    <Menu
      open={!!contextMenu}
      onClose={() => setContextMenu(null)}
      anchorReference="anchorPosition"
      {...(contextMenu && { anchorPosition: { top: contextMenu.mouseY, left: contextMenu.mouseX } })}
    >
      <List dense disablePadding>
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
