import { Menu } from '../../components/Menu'
import { List, ListItemButton, ListItemText } from '@mui/material'
import { setSelectedModelIndex } from '../../services/globals'
import { useDispatch, useSelector } from 'react-redux'
import { useGetModelsQuery } from '../../services/models'

export const ContextMenu = ({ contextMenu, setContextMenu }) => {
  const dispatch = useDispatch()
  const { data: models } = useGetModelsQuery()
  const { selectedModelIndex } = useSelector(state => state.globals)

  if (!models) return null
  else
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
