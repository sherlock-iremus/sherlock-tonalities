import { TextSnippet } from '@mui/icons-material'
import { capitalize, Chip, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useGetEntityTypeQuery } from '../../../app/services/sparql'
import { LoadingEntity } from '../entities/LoadingEntity'
import { Item } from './Item'

export const AnnotationValueItem = ({ type, value }) => {
  const { data } = useGetEntityTypeQuery(value, { skip: type === 'literal' })
  if (type === 'literal')
    return (
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <TextSnippet />
          </ListItemIcon>
          <ListItemText primary={<Chip label={capitalize(value)} />} secondary="Arbitrary text" />
        </ListItemButton>
      </ListItem>
    )
  else if (data) return <Item {...data} />
  return <LoadingEntity />
}
