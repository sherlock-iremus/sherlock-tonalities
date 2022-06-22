import { AudioFile, CompareArrows } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetScoreSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedEntity, setScore, setSelectedEntity } from '../../../app/services/scoreSlice'
import { useNavigate } from 'react-router-dom'

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
  const { selectionIri: inspectedSelection, scoreIri: inspectedScore } = inspectedEntities[currentEntityIndex]
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <Tooltip title="Switch score">
            <IconButton onClick={() => navigate(0)}>
              <CompareArrows />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemButton
          onClick={() => dispatch(setInspectedEntity({ scoreIri }))}
          selected={inspectedScore === scoreIri}
        >
          <ListItemIcon>
            <AudioFile />
          </ListItemIcon>
          <ListItemText primary="Current score" secondary={scoreIri.slice(baseUrl.length)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Created selections</ListSubheader>}>
        {selections?.map(selection => (
          <ListItem key={selection.iri} disablePadding>
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
                secondary={selection.iri.slice(baseUrl.length)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}
