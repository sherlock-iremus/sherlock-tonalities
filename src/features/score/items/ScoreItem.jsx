import { Close, AudioFile } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { getScoreLabel } from '../utils'
import { withDispatch } from './withDispatch'

const BaseScoreItem = ({ scoreIri, baseUrlLength, dispatch }) => {
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
        <ListItemText primary={getScoreLabel(scoreIri)} secondary={scoreIri.slice(baseUrlLength)} />
      </ListItemButton>
    </ListItem>
  )
}

export const ScoreItem = withDispatch(BaseScoreItem)
