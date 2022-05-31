import { AudioFile } from '@mui/icons-material'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetScoreSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedSelection, setSelectedSelection } from '../../slice/scoreSlice'

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
      <List subheader={<ListSubheader>Current score</ListSubheader>}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AudioFile />
            </ListItemIcon>
            <ListItemText primary="Score title" secondary={scoreIri.slice(baseUrl.length)} />
          </ListItemButton>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>Created selections on this score</ListSubheader>}>
        {selections?.map(selection => (
          <ListItem key={selection.iri} disablePadding secondaryAction={props.secondaryAction}>
            <ListItemButton
              onClick={() =>
                (isInspectionMode && dispatch(setInspectedSelection(selection.iri))) ||
                (isSelectionMode && dispatch(setSelectedSelection(selection.iri)))
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
