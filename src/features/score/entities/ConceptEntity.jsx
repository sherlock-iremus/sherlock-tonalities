import { Close, HistoryEdu } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useSelector } from 'react-redux'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { withDispatch } from '../items/withDispatch'
import { AnalyticalEntities } from '../annotations/AnalyticalEntities'

const BaseConceptEntity = ({ conceptIri, baseUrlLength, dispatch }) => {
  const { treatiseIri } = useSelector(state => state.score)

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ conceptIri }))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <HistoryEdu />
          </ListItemIcon>
          <ListItemText
            primary={conceptIri.slice(treatiseIri.length)}
            secondary={treatiseIri.slice(baseUrlLength + 3)}
          />
        </ListItemButton>
      </ListItem>
      <AnalyticalEntities {...{ conceptIri }} />
    </>
  )
}

export const ConceptEntity = withDispatch(BaseConceptEntity)
