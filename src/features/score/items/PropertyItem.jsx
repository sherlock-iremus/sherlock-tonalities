import { Sell } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useSelector } from 'react-redux'
import { useGetPredicatLabelQuery } from '../../../app/services/sparql'
import { getConceptLabel, getTreatiseIri } from '../../../app/treatises/treatises'
import { withDispatch } from './withDispatch'

const BasePropertyItem = ({ propertyIri, baseUrlLength }) => {
  const { data: label } = useGetPredicatLabelQuery(propertyIri)
  const { tonalityBaseUrl } = useSelector(state => state.score)
  label && console.log(label)
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ cursor: 'default' }}>
        <ListItemIcon>
          <Sell />
        </ListItemIcon>
        <ListItemText
          primary={label || getConceptLabel(propertyIri)}
          secondary={getTreatiseIri(propertyIri)?.slice(tonalityBaseUrl.length) || "Generic concept"}
        />
      </ListItemButton>
    </ListItem>
  )
}
export const PropertyItem = withDispatch(BasePropertyItem)
