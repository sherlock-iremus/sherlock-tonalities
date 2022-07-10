import { HistoryEdu } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getConceptLabel, getTreatiseIri } from '../../../app/treatises/treatises'
import { setInspectedEntity } from '../../../app/services/scoreSlice'

export const ClassItem = ({ classIri, label, secondaryAction }) => {
  const { tonalityBaseUrl } = useSelector(state => state.score)
  const dispatch = useDispatch()
  return (
    <ListItem disablePadding secondaryAction={secondaryAction}>
      <ListItemButton onClick={() => dispatch(setInspectedEntity({ conceptIri: classIri }))}>
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
