import { Sell } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useGetPredicatLabelQuery } from '../../../app/services/sparql'
import { withDispatch } from './withDispatch'

const BasePropertyItem = ({ propertyIri, baseUrlLength }) => {
  const { data: label } = useGetPredicatLabelQuery(propertyIri)
  label && console.log(label)
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ cursor: 'default' }}>
        <ListItemIcon>
          <Sell />
        </ListItemIcon>
        <ListItemText primary={label} secondary={propertyIri.slice(baseUrlLength)} />
      </ListItemButton>
    </ListItem>
  )
}
export const PropertyItem = withDispatch(BasePropertyItem)
