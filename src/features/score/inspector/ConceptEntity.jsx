import { HistoryEdu } from '@mui/icons-material'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetConceptAnnotationsQuery } from '../../../app/services/sparql'
import { setAnnotationId } from '../../inspection/inspectedEntitySlice'
import { LoadingEntity } from './LoadingEntity'

export const ConceptEntity = props => {
  const { data: annotations } = useGetConceptAnnotationsQuery(props.concept)
  const dispatch = useDispatch()

  return props.concept && annotations ? (
    <>
      <ListItem disablePadding>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <HistoryEdu />
          </ListItemIcon>
          <ListItemText primary={props.concept.slice(props.treatiseIri.length)} secondary={props.treatiseIri.slice(props.baseUrl.length+3)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Created annalytical entities</ListSubheader>}>
        {annotations.map(annotation => (
          <ListItem key={annotation.iri} disablePadding>
            <ListItemButton onClick={() => dispatch(setAnnotationId(annotation.iri))}>
              <ListItemText primary={annotation.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
