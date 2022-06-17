import { Close, AudioFile } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { withDispatch } from './withDispatch'

const baseScoreItem = ({ scoreIri, baseUrlLength, dispatch }) =>
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
        <ListItemText primary="Score" secondary={scoreIri.slice(baseUrlLength)} />
      </ListItemButton>
    </ListItem>

export const ScoreItem = withDispatch(baseScoreItem)
