import { Close, HistoryEdu } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useSelector } from 'react-redux'
import { useGetConceptAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { LoadingEntity } from './LoadingEntity'
import { withDispatch } from '../items/withDispatch'

const BaseConceptEntity = ({ conceptIri, baseUrlLength, dispatch }) => {
  const { data: analyticalEntities } = useGetConceptAnnotationsQuery(conceptIri)
  const { treatiseIri } = useSelector(state => state.score)

  return analyticalEntities ? (
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
      <List subheader={<ListSubheader>Is used in annalytical entities</ListSubheader>}>
        {analyticalEntities.map(({ iri: analyticalEntityIri}, index) => (
          <ListItem key={analyticalEntityIri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ analyticalEntityIri }))}>
              <ListItemText
                primary={`${conceptIri.slice(treatiseIri.length)} ${++index}`}
                secondary={analyticalEntityIri.slice(baseUrlLength)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}

export const ConceptEntity = withDispatch(BaseConceptEntity)