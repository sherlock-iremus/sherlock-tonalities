import { Close, HistoryEdu } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetConceptAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedAnnotation, setInspectedConcept } from '../../slice/scoreSlice'
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
          <IconButton disableRipple onClick={() => dispatch(setInspectedConcept(props.conceptIri))}>
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
            <ListItemButton onClick={() => dispatch(setInspectedAnnotation(annotation.iri))}>
              <ListItemText primary={props.conceptIri.slice(treatiseIri.length) + ' ' + ++index } />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
