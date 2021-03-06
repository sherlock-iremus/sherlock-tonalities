import { Add, AudioFile, CompareArrows, Delete } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SpeedDial,
  Tooltip,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetScoreSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedEntity, setSelectedEntity, setSelectionMode } from '../../../app/services/scoreSlice'
import { useNavigate } from 'react-router-dom'
import { COLOR_NAVIGATE } from '../mei.css'
import { useGetUserIdQuery } from '../../../app/services/sherlockApi'
import { ContributorItem } from '../items/ContributorItem'

export const Selections = props => {
  const { data: selections } = useGetScoreSelectionsQuery(props.scoreIri)
  const { data: userId } = useGetUserIdQuery()
  const {
    inspectedEntities,
    currentEntityIndex,
    isInspectionMode,
    isSelectionMode,
    selectedEntities,
    scoreIri,
    scoreTitle,
    baseUrl,
  } = useSelector(state => state.score)
  const { selectionIri: inspectedSelection, scoreIri: inspectedScore } = inspectedEntities[currentEntityIndex]
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <>
      <ListSubheader>Current score</ListSubheader>
      <ListItem
        disablePadding
        secondaryAction={
          <Tooltip title="Change score">
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
          <ListItemText primary={scoreTitle} secondary={scoreIri.slice(baseUrl.length)} />
        </ListItemButton>
      </ListItem>

      <List subheader={<ListSubheader>Created selections</ListSubheader>}>
        {selections
          ?.filter(s => s.contributorIri.slice(baseUrl.length) === userId)
          .map(selection => (
            <ListItem
              key={selection.iri}
              disablePadding
              secondaryAction={
                <IconButton disabled>
                  <Delete />
                </IconButton>
              }
            >
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

      <List subheader={<ListSubheader>Other selections</ListSubheader>}>
        {selections?.filter(s => s.contributorIri.slice(baseUrl.length) !== userId).map(selection => (
          <ListItem
            key={selection.iri}
            disablePadding
            secondaryAction={<ContributorItem contributorIri={selection.contributorIri} />}
          >
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
      {!isSelectionMode && (
        <Tooltip title="Create new selection">
          <SpeedDial
            ariaLabel="New selection"
            onClick={() => dispatch(setSelectionMode())}
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 370,
              '& .MuiSpeedDial-fab': { backgroundColor: COLOR_NAVIGATE },
            }}
            icon={<Add />}
          />
        </Tooltip>
      )}
    </>
  )
}
