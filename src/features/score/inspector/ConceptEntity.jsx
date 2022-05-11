import { HistoryEdu } from '@mui/icons-material'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetConceptAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedAnnotation } from '../../slice/scoreSlice'
import { LoadingEntity } from './LoadingEntity'

export const ConceptEntity = props => {
  const { data: annotations } = useGetConceptAnnotationsQuery(props.conceptIri)
  const dispatch = useDispatch()

  return annotations ? (
    <>
      <ListItem disablePadding>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <HistoryEdu />
          </ListItemIcon>
          <ListItemText primary={props.conceptIri.slice(props.treatiseIri.length)} secondary={props.treatiseIri.slice(props.baseUrl.length+3)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Annalytical entities</ListSubheader>}>
        {annotations.map(annotation => (
          <ListItem key={annotation.iri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedAnnotation(annotation.iri))}>
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
