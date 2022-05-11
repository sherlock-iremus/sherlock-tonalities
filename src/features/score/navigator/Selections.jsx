import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetScoreSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedSelection } from '../../slice/scoreSlice'

export const Selections = props => {
  const { data: selections } = useGetScoreSelectionsQuery(props.scoreIri)
  const dispatch = useDispatch()

  return (
    <List>
      {selections?.map((selection, index) => (
        <ListItem key={selection.iri} disablePadding secondaryAction={props.secondaryAction}>
          <ListItemButton onClick={() => dispatch(setInspectedSelection(selection.iri))}>
            <ListItemText
              primary={'Selection ' + (index + 1)}
              secondary={selection.entities + ' elements'}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
