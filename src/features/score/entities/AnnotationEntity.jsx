import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useGetAnnotationInfoQuery, useGetSubAnnotationsQuery } from '../../../app/services/sparql'
import { ConceptItem } from '../items/ConceptItem'
import { NoteItem } from '../items/NoteItem'
import { LoadingEntity } from './LoadingEntity'

export const AnnotationEntity = props => {
  const { data: concepts } = useGetAnnotationInfoQuery(props.annotationIri)
  const { data: subAnnotations } = useGetSubAnnotationsQuery(props.annotationIri)

  return concepts && subAnnotations ? (
    <>
      <ListItem disablePadding>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemText
            primary={concepts.map(concept => (
              <ConceptItem key={concept} conceptIri={concept} treatiseIri={props.treatiseIri} />
            ))}
            secondary={props.annotationIri.slice(props.baseUrl.length)}
          />
        </ListItemButton>
      </ListItem>
      <List sx={{ pl: 2 }} dense disablePadding subheader={<ListSubheader>Associated selection</ListSubheader>}>
        {subAnnotations.map(subAnnotation => (
          <NoteItem
            disablePadding
            key={subAnnotation.entity}
            noteIri={subAnnotation.entity}
            scoreIri={props.scoreIri}
            baseUrl={props.baseUrl}
            secondaryAction={<ConceptItem conceptIri={subAnnotation.concept} treatiseIri={props.treatiseIri} />}
          />
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
