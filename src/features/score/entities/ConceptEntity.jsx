import { Close, HistoryEdu } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetConceptAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../slice/scoreSlice'
import { LoadingEntity } from './LoadingEntity'

export const ConceptEntity = props => {
  const { data: annotations } = useGetConceptAnnotationsQuery(props.conceptIri)
  const dispatch = useDispatch()
  const { treatiseIri } = useSelector(state => state.score)

  return annotations ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ conceptIri: props.conceptIri }))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <HistoryEdu />
          </ListItemIcon>
          <ListItemText
            primary={props.conceptIri.slice(treatiseIri.length)}
            secondary={treatiseIri.slice(props.baseUrl.length + 3)}
          />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Is used in annalytical entities</ListSubheader>}>
        {annotations.map((annotation, index) => (
          <ListItem key={annotation.iri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri: annotation.iri }))}>
              <ListItemText
                primary={props.conceptIri.slice(treatiseIri.length) + ' ' + ++index}
                secondary={annotation.iri.slice(props.baseUrl.length)}
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
