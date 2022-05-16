import { Close, HistoryEdu } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetConceptAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedAnnotation, setInspectedConcept } from '../../slice/scoreSlice'
import { LoadingEntity } from './LoadingEntity'

export const ConceptEntity = props => {
  const { data: annotations } = useGetConceptAnnotationsQuery(props.conceptIri)
  const dispatch = useDispatch()

  return annotations ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton onClick={() => dispatch(setInspectedConcept(props.conceptIri))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <HistoryEdu />
          </ListItemIcon>
          <ListItemText
            primary={props.conceptIri.slice(props.treatiseIri.length)}
            secondary={props.treatiseIri.slice(props.baseUrl.length + 3)}
          />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Is used in annalytical entities</ListSubheader>}>
        {annotations.map((annotation, index) => (
          <ListItem key={annotation.iri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedAnnotation(annotation.iri))}>
              <ListItemText primary={props.conceptIri.slice(props.treatiseIri.length) + ' ' + index} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
