import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'

export const Degrees = () => {
  const degrees = [
    { id: '1', label: 'C' },
    { id: '2', label: 'C♯' },
    { id: '3', label: 'D' },
    { id: '4', label: 'E♭' },
    { id: '5', label: 'E' },
    { id: '6', label: 'F' },
    { id: '7', label: 'G' },
    { id: '8', label: 'G♯' },
    { id: '9', label: 'A' },
    { id: '10', label: 'B♭' },
    { id: '11', label: 'B' },
  ]

  return (
    <List subheader={<ListSubheader>Scale degrees on the diatonic scale</ListSubheader>}>
      {degrees.map(degree => (
        <ListItem key={degree.id} disablePadding>
          <ListItemButton>
            <ListItemText primary={degree.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
