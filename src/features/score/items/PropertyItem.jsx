import { Sell } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useGetPredicatLabelQuery } from '../../../app/services/sparql'
import { getConceptLabel, getTreatiseIri } from '../../../app/treatises/treatises'
import { withDispatch } from './withDispatch'
import { setInspectedEntity } from '../../../app/services/scoreSlice'

const BasePropertyItem = ({ propertyIri, baseUrlLength }) => {
  const { data: label } = useGetPredicatLabelQuery(propertyIri)
  const { tonalityBaseUrl } = useSelector(state => state.score)
  const dispatch = useDispatch()
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => dispatch(setInspectedEntity({ propertyIri }))}>
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
export const PropertyItem = withDispatch(BasePropertyItem)
