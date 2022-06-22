import { Close, AudioFile } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useSelector } from 'react-redux'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { withDispatch } from './withDispatch'

const BaseScoreItem = ({ baseUrlLength, dispatch }) => {
  const { scoreIri, scoreTitle } = useSelector(state => state.score)
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
        <ListItemText primary={scoreTitle} secondary={scoreIri.slice(baseUrlLength)} />
      </ListItemButton>
    </ListItem>
  )
}

export const ScoreItem = withDispatch(BaseScoreItem)
