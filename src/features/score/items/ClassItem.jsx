import { HistoryEdu } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useSelector } from 'react-redux'
import { getConceptLabel, getTreatiseIri } from '../../../app/treatises/treatises'

export const ClassItem = ({ classIri, label, secondaryAction }) => {
  const { tonalityBaseUrl } = useSelector(state => state.score)
  return (
    <ListItem disablePadding secondaryAction={secondaryAction}>
      <ListItemButton sx={{ cursor: 'default' }}>
        <ListItemIcon>
          <HistoryEdu />
        </ListItemIcon>
        <ListItemText
          primary={label || getConceptLabel(classIri)}
          secondary={getTreatiseIri(classIri)?.slice(tonalityBaseUrl.length)}
        />
      </ListItemButton>
    </ListItem>
  )
}
