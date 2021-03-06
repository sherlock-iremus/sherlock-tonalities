import { Close, HistoryEdu } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getConceptLabel, getTreatiseIri } from '../../../app/treatises/treatises'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetPredicatLabelQuery } from '../../../app/services/sparql'

export const ClassItem = ({ classIri, label, secondaryAction, isEntity }) => {
  const { tonalityBaseUrl } = useSelector(state => state.score)
  const { data } = useGetPredicatLabelQuery(classIri, { skip: label })
  const dispatch = useDispatch()
  return (
    <ListItem
      disablePadding
      secondaryAction={
        secondaryAction ||
        (isEntity && (
          <IconButton onClick={() => dispatch(setInspectedEntity({ conceptIri: classIri }))}>
            <Close />
          </IconButton>
        ))
      }
    >
      <ListItemButton onClick={() => !isEntity && dispatch(setInspectedEntity({ conceptIri: classIri }))}>
        <ListItemIcon>
          <HistoryEdu />
        </ListItemIcon>
        <ListItemText
          primary={label || data || getConceptLabel(classIri)}
          secondary={getTreatiseIri(classIri)?.slice(tonalityBaseUrl.length) || 'Generic concept'}
        />
      </ListItemButton>
    </ListItem>
  )
}
