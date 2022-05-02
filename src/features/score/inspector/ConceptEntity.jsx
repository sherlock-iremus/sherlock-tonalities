import { HistoryEdu, Lyrics } from '@mui/icons-material'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useGetConceptAnnotationsQuery } from '../../../app/services/sparql'
import { LoadingNode } from './LoadingEntity'

export const ConceptNode = props => {
  const { data: annotations } = useGetConceptAnnotationsQuery(props.concept)
  return props.concept && annotations ? (
    <>
      <ListItem disablePadding>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <HistoryEdu />
          </ListItemIcon>
          <ListItemText primary={props.concept.slice(props.treatiseIri.length)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Created annalytical entities</ListSubheader>}>
        {annotations.map(annotation => (
          <ListItem key={annotation.iri} disablePadding>
            <ListItemButton sx={{ cursor: 'default' }}>
              <ListItemIcon>
                <Lyrics />
              </ListItemIcon>
              <ListItemText primary={annotation.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingNode />
  )
}
