import { Close, Lyrics } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import {
  useGetAnnotationInfoQuery,
  useGetAnnotationSelectionQuery,
  useGetSubAnnotationsQuery,
} from '../../../app/services/sparql'
import { setInspectedAnnotation } from '../../slice/scoreSlice'
import { ConceptItem } from '../items/ConceptItem'
import { SelectionItem } from '../items/SelectionItem'
import { LoadingEntity } from './LoadingEntity'

export const AnnotationEntity = props => {
  const { data: concepts } = useGetAnnotationInfoQuery(props.annotationIri)
  const { data: subAnnotations } = useGetSubAnnotationsQuery(props.annotationIri)
  const { data: selectionIri } = useGetAnnotationSelectionQuery(props.annotationIri)
  const dispatch = useDispatch()

  return concepts && subAnnotations && selectionIri ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedAnnotation(props.annotationIri))}>
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

      <ListSubheader>Associated selection</ListSubheader>
      <SelectionItem selectionIri={selectionIri} baseUrl={props.baseUrl} concepts={subAnnotations} />
    </>
  ) : (
    <LoadingEntity />
  )
}
