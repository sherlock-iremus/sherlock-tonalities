import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'

export const Degrees = () => {
  const degrees = [
    { id: '1', label: 'Tonic', note: 'C' },
    { id: '2', label: 'Supertonic', note: 'D' },
    { id: '3', label: 'Mediant', note: 'E' },
    { id: '4', label: 'Subdominant', note: 'F' },
    { id: '5', label: 'Dominant', note: 'G' },
    { id: '6', label: 'Subdominant', note: 'A' },
    { id: '7', label: 'Subtonic/Leading tone', note: 'B' },
  ]

  return (
    <List subheader={<ListSubheader>Scale degrees on the diatonic scale</ListSubheader>}>
      {degrees.map(degree => (
        <ListItem key={degree.id} disablePadding secondaryAction={degree.note}>
          <ListItemButton>
            <ListItemIcon>
              {degree.id}
            </ListItemIcon>
            <ListItemText primary={degree.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
