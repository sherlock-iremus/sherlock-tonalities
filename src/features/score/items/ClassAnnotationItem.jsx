import { Comment, TextSnippet } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetEntityTypeQuery } from '../../../app/services/sparql'
import { LoadingEntity } from '../entities/LoadingEntity'
import { Item } from './Item'

export const ClassAnnotationItem = ({ type, value, annotationIri }) => {
  const dispatch = useDispatch()
  const { data } = useGetEntityTypeQuery(value, { skip: type === 'litteral' })
  if (type === 'litteral')
    return (
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <TextSnippet />
          </ListItemIcon>
          <ListItemText primary={value} secondary="Arbitrary text" />
        </ListItemButton>
      </ListItem>
    )
  else if (data)
    return (
      <Item
        {...data}
        secondaryAction={
          <IconButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
            <Comment />
          </IconButton>
        }
      />
    )
  return <LoadingEntity />
}
