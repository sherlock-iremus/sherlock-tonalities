import { ListItem } from '@mui/material'
import { IconButton, ListItemButton, ListItemText } from '@mui/material'
import { Delete } from '@mui/icons-material'

import { useDispatch, useSelector } from 'react-redux'
import { setAlert, setInspectedEntity, setSelectedEntity } from '../../../../app/services/scoreSlice'
import { useDeleteSelectionMutation } from '../../../../app/services/sherlockApi'
import { getUuidFromSherlockIri } from '../../utils'
import { ContributorItem } from '../../items/ContributorItem'

export const SelectionItem = props => {
  const dispatch = useDispatch()
  const [deleteSelection] = useDeleteSelectionMutation()
  const { isInspectionMode, isSelectionMode, selectedEntities, inspectedEntities, currentEntityIndex } =
    useSelector(state => state.score)

  const onClick = iri => {
    deleteSelection(getUuidFromSherlockIri(iri))
      .unwrap()
      .then(() => {
        props.refetch()
        dispatch(setAlert({ confirmation: 'Selection successfully deleted' }))
      })
      .catch(() => dispatch(setAlert({ error: 'An error occured while deleting selection' })))
  }

  const { selectionIri: inspectedSelection } = inspectedEntities[currentEntityIndex]
  const analyticalEntitiesTypesStr = props.selection.analyticalEntitiesTypes.map((type) => type && type.substring(type.indexOf('#') + 1) ).join(' • ')

  return (
    <ListItem
      disablePadding
      secondaryAction={ props.isUserContribution 
        ?<IconButton onClick={() => onClick(props.selection.iri)}>
          <Delete />
        </IconButton> 
        : <ContributorItem contributorIri={props.selection.contributorIri} />
      }
    >
      <ListItemButton
        onClick={() =>
          (isInspectionMode && dispatch(setInspectedEntity({ selectionIri: props.selection.iri }))) ||
          (isSelectionMode && dispatch(setSelectedEntity({ selectionIri: props.selection.iri })))
        }
        selected={
          (isInspectionMode && props.selection.iri === inspectedSelection) ||
          (isSelectionMode && !!selectedEntities.find(s => s.selectionIri === props.selection.iri))
        }
      >
        
        <ListItemText
          primary={`Selection with ${props.selection.entities} elements • measure ${props.selection.minMeasureNumber} `}
          secondary={`📝 ${analyticalEntitiesTypesStr}`}
        />
        <ListItemText
          
        />
        
      </ListItemButton>
    </ListItem>
  )
}
