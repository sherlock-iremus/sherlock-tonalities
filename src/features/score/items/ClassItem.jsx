import { HistoryEdu } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { withDispatch } from './withDispatch'

const BaseClassItem = ({ classIri, label, baseUrlLength }) => (
  <ListItem disablePadding>
    <ListItemButton sx={{ cursor: 'default' }}>
      <ListItemIcon>
        <HistoryEdu />
      </ListItemIcon>
      <ListItemText primary={label} secondary={classIri.slice(baseUrlLength)} />
    </ListItemButton>
  </ListItem>
)

export const ClassItem = withDispatch(BaseClassItem)
