import { Close, Lyrics } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import {
  useGetAnnotationInfoQuery,
  useGetAnnotationSelectionQuery,
  useGetSubAnnotationsQuery,
} from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { ConceptItem } from '../items/ConceptItem'
import { SelectionItem } from '../items/SelectionItem'
import { LoadingEntity } from './LoadingEntity'
import { withDispatch } from '../items/withDispatch'

const BaseAnalyticalEntity = ({ analyticalEntityIri, baseUrlLength, dispatch }) => {
  const { data: concepts } = useGetAnnotationInfoQuery(analyticalEntityIri)
  const { data: subAnnotations } = useGetSubAnnotationsQuery(analyticalEntityIri)
  const { data: selectionIri } = useGetAnnotationSelectionQuery(analyticalEntityIri)
  return concepts && subAnnotations && selectionIri ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ analyticalEntityIri }))}>
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
            secondary={analyticalEntityIri.slice(baseUrlLength)}
          />
        </ListItemButton>
      </ListItem>

      <ListSubheader>Associated selection</ListSubheader>
      <SelectionItem {...{ selectionIri }} concepts={subAnnotations} />
    </>
  ) : (
    <LoadingEntity />
  )
}

export const AnalyticalEntity = withDispatch(BaseAnalyticalEntity)
