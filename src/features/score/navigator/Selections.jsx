import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useGetScoreSelectionsQuery } from '../../../app/services/sparql'

export const Selections = props => {
  const { data: selections } = useGetScoreSelectionsQuery(props.scoreIri)

  return (
    <List>
      {selections?.map((selection, index) => (
        <ListItem disablePadding secondaryAction={props.secondaryAction}>
          <ListItemButton>
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
