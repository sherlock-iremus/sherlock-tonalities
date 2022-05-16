import { Close, Lyrics } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetAnnotationInfoQuery, useGetSubAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedAnnotation, setInspectedNote } from '../../slice/scoreSlice'
import { ConceptItem } from '../items/ConceptItem'
import { NoteItem } from '../items/NoteItem'
import { LoadingEntity } from './LoadingEntity'

export const AnnotationEntity = props => {
  const { data: concepts } = useGetAnnotationInfoQuery(props.annotationIri)
  const { data: subAnnotations } = useGetSubAnnotationsQuery(props.annotationIri)
  const dispatch = useDispatch()

  return concepts && subAnnotations ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton onClick={() => dispatch(setInspectedAnnotation(props.annotationIri))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <Lyrics />
          </ListItemIcon>
          <ListItemText
            primary={concepts.map(concept => (
              <ConceptItem key={concept} conceptIri={concept} />
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
            secondaryAction={<ConceptItem conceptIri={subAnnotation.concept} />}
          />
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
