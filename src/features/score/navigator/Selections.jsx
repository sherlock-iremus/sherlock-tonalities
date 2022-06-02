import { AudioFile } from '@mui/icons-material'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetScoreSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedEntity, setSelectedEntity } from '../../slice/scoreSlice'

export const Selections = props => {
  const { data: selections } = useGetScoreSelectionsQuery(props.scoreIri)
  const {
    inspectedEntities,
    currentEntityIndex,
    isInspectionMode,
    isSelectionMode,
    selectedEntities,
    scoreIri,
    baseUrl,
  } = useSelector(state => state.score)
  const { selectionIri: inspectedSelection } = inspectedEntities[currentEntityIndex]
  const dispatch = useDispatch()

  return (
    <>
      <List subheader={<ListSubheader>Global elements</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => dispatch(setInspectedEntity({ scoreIri }))}>
            <ListItemIcon>
              <AudioFile />
            </ListItemIcon>
            <ListItemText primary="Current score" secondary={scoreIri.slice(baseUrl.length)} />
          </ListItemButton>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>Created selections</ListSubheader>}>
        {selections?.map(selection => (
          <ListItem key={selection.iri} disablePadding secondaryAction={props.secondaryAction}>
            <ListItemButton
              onClick={() =>
                (isInspectionMode && dispatch(setInspectedEntity({ selectionIri: selection.iri }))) ||
                (isSelectionMode && dispatch(setSelectedEntity({ selectionIri: selection.iri })))
              }
              selected={
                (isInspectionMode && selection.iri === inspectedSelection) ||
                (isSelectionMode && !!selectedEntities.find(s => s.selectionIri === selection.iri))
              }
            >
              <ListItemText
                primary={`Selection with ${selection.entities} elements`}
                secondary={selection.iri.slice(props.baseUrl.length)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}
