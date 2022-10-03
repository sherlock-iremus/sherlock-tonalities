import { Close, Sell } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useGetPredicatLabelQuery } from '../../../app/services/sparql'
import { getConceptLabel, getTreatiseIri } from '../../../app/treatises/treatises'
import { setInspectedEntity } from '../../../app/services/scoreSlice'

export const PropertyItem = ({ propertyIri, isEntity }) => {
  const { data: label } = useGetPredicatLabelQuery(propertyIri)
  const { tonalityBaseUrl } = useSelector(state => state.score)
  const dispatch = useDispatch()
  return (
    <ListItem
      disablePadding
      secondaryAction={
        isEntity && (
          <IconButton onClick={() => dispatch(setInspectedEntity({ propertyIri }))}>
            <Close />
          </IconButton>
        )
      }
    >
      <ListItemButton>
        <ListItemIcon>
          <Sell />
        </ListItemIcon>
        <ListItemText
          primary={label || getConceptLabel(propertyIri)}
          secondary={getTreatiseIri(propertyIri)?.slice(tonalityBaseUrl.length) || 'Generic concept'}
        />
      </ListItemButton>
    </ListItem>
  )
}
