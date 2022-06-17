import { Close, Lyrics } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import {
  useGetAnnotationInfoQuery,
  useGetAnnotationSelectionQuery,
  useGetSubAnnotationsQuery,
} from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { ConceptItem } from '../items/ConceptItem'
import { SelectionItem } from '../items/SelectionItem'
import { LoadingEntity } from './LoadingEntity'

export const AnnotationEntity = ({ annotationIri, baseUrl }) => {
  const { data: concepts } = useGetAnnotationInfoQuery(annotationIri)
  const { data: subAnnotations } = useGetSubAnnotationsQuery(annotationIri)
  const { data: selectionIri } = useGetAnnotationSelectionQuery(annotationIri)
  const dispatch = useDispatch()

  return concepts && subAnnotations && selectionIri ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
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
            secondary={annotationIri.slice(baseUrl.length)}
          />
        </ListItemButton>
      </ListItem>

      <ListSubheader>Associated selection</ListSubheader>
      <SelectionItem {...{ selectionIri, baseUrl }} concepts={subAnnotations} />
    </>
  ) : (
    <LoadingEntity />
  )
}
