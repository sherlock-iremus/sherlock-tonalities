import { Delete, Lyrics } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip } from '@mui/material'
import {
  useGetAnalyticalEntityQuery,
  useGetEntityGlobalAnnotationsQuery,
  useGetEntitySpecificAnnotationsQuery,
} from '../../../app/services/sparql'
import { removeInspectedEntity, removeNInspectedEntities, setAlert, setInspectedEntity } from '../../../app/services/scoreSlice'
import { SelectionItem } from '../items/SelectionItem'
import { LoadingEntity } from './LoadingEntity'
import { ContributorItem } from '../items/ContributorItem'
import { withDispatch } from '../items/withDispatch'
import { ClassAnnotationItem } from '../items/ClassAnnotationItem'
import { PropertyAnnotationItem } from '../items/PropertyAnnotationItem'
import { useDeleteAnalyticalEntityMutation } from '../../../app/services/sherlockApi'
import { getUuidFromSherlockIri } from '../utils'
import { useConfirm } from 'material-ui-confirm'

const BaseAnalyticalEntity = ({ analyticalEntityIri, baseUrlLength, dispatch }) => {
  const confirm = useConfirm();
  const { data } = useGetAnalyticalEntityQuery(analyticalEntityIri)
  const { data: globalAnnotations } = useGetEntityGlobalAnnotationsQuery(analyticalEntityIri)
  const { data: specificAnnotations } = useGetEntitySpecificAnnotationsQuery(analyticalEntityIri)
  const [deleteAnalyticalEntity] = useDeleteAnalyticalEntityMutation()

  const confirmDeletion = () => {
    confirm({description: 'Delete this analytical entity and all annotations linked ?', confirmationButtonProps: {color: 'error'}, confirmationText: 'DELETE'})
      .then(() => {
        deleteAnalyticalEntity(getUuidFromSherlockIri(analyticalEntityIri)).unwrap()
          .then(() => {
            dispatch(setAlert({ confirmation: 'Analytical entity successfully deleted. Refresh this page' }))
          })
      })
  }
  return data && globalAnnotations && specificAnnotations ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <Tooltip title="Delete analytical entity">
            <IconButton toolti disableRipple onClick={confirmDeletion}>
              <Delete />
            </IconButton>
          </Tooltip>
        }
        action
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <Lyrics />
          </ListItemIcon>
          <ListItemText
            primary={`Analytical entity with ${globalAnnotations.length + specificAnnotations.length} assignments`}
            secondary={analyticalEntityIri.slice(baseUrlLength)}
          />
        </ListItemButton>
      </ListItem>

      <ListSubheader>Contributor</ListSubheader>
      <ListItem disablePadding>
        <ListItemButton onClick={() => dispatch(setInspectedEntity({ contributorIri: data.contributorIri }))}>
          <ListItemIcon>
            <ContributorItem contributorIri={data.contributorIri} />
          </ListItemIcon>
          <ListItemText
            primary={`Created on ${new Date(data.date).toLocaleDateString('en-GB')}`}
            secondary={data.contributorIri.slice(baseUrlLength)}
          />
        </ListItemButton>
      </ListItem>

      <ListSubheader>Target selection</ListSubheader>
      <SelectionItem selectionIri={data.selectionIri} initialIsOpen={false} concepts={specificAnnotations} />

      <ListSubheader>Assigned types</ListSubheader>
      {globalAnnotations.map(({ annotationIri, object }) => (
        <ClassAnnotationItem key={annotationIri} {...object} annotationIri={annotationIri} />
      ))}

      <ListSubheader>Assigned properties</ListSubheader>
      {specificAnnotations.map(e => (
        <PropertyAnnotationItem key={e.annotationIri} propertyIri={e.propertyIri} annotation={e} />
      ))}
    </>
  ) : (
    <LoadingEntity />
  )
}

export const AnalyticalEntity = withDispatch(BaseAnalyticalEntity)
