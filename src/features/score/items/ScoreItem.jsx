import { Close, AudioFile } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedEntity } from '../../slice/scoreSlice'

export const ScoreItem = () => {
  const dispatch = useDispatch()
  const { scoreIri, baseUrl } = useSelector(state => state.score)

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ scoreIri }))}>
          <Close />
        </IconButton>
      }
    >
      <ListItemButton sx={{ cursor: 'default' }}>
        <ListItemIcon>
          <AudioFile />
        </ListItemIcon>
        <ListItemText primary="Score" secondary={scoreIri.slice(baseUrl.length)} />
      </ListItemButton>
    </ListItem>
  )
}
