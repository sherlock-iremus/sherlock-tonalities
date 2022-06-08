import { Close, HistoryEdu } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetConceptAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../slice/scoreSlice'
import { LoadingEntity } from './LoadingEntity'

export const ConceptEntity = ({ conceptIri, baseUrl }) => {
  const { data: annotations } = useGetConceptAnnotationsQuery(conceptIri)
  const dispatch = useDispatch()
  const { treatiseIri } = useSelector(state => state.score)

  return annotations ? (
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
            secondary={treatiseIri.slice(baseUrl.length + 3)}
          />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Is used in annalytical entities</ListSubheader>}>
        {annotations.map(({ iri: annotationIri}, index) => (
          <ListItem key={annotationIri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
              <ListItemText
                primary={`${conceptIri.slice(treatiseIri.length)} ${++index}`}
                secondary={annotationIri.slice(baseUrl.length)}
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
