import { ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton } from '@mui/material'

export const LoadingEntity = () => (
  <ListItem disablePadding>
    <ListItemButton sx={{ cursor: 'default' }}>
      <ListItemIcon>
        <Skeleton variant="circular" width={40} height={40} />
      </ListItemIcon>
      <ListItemText
        primary={<Skeleton width="75%" heigth="100%" />}
        secondary={<Skeleton width="50%" heigth="100%" />}
      />
    </ListItemButton>
  </ListItem>
)
