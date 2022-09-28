import { Add, AudioFile, CompareArrows } from '@mui/icons-material'
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
import { setInspectedEntity, setSelectionMode } from '../../../app/services/scoreSlice'
import { useNavigate } from 'react-router-dom'
import { COLOR_NAVIGATE } from '../mei.css'
import { useGetUserIdQuery } from '../../../app/services/sherlockApi'
import { SelectionItem } from './selections/SelectionItem'

export const Selections = props => {
  const { data: selections, refetch } = useGetScoreSelectionsQuery(props.scoreIri)
  const { data: userId } = useGetUserIdQuery()
  const { inspectedEntities, currentEntityIndex, isSelectionMode, scoreIri, scoreTitle, baseUrl } = useSelector(
    state => state.score
  )
  const { scoreIri: inspectedScore } = inspectedEntities[currentEntityIndex]
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <>
      <ListSubheader>Current score</ListSubheader>
      <ListItem
        disablePadding
        secondaryAction={
          <Tooltip title="Change score">
            <IconButton onClick={() => navigate('/')}>
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

      <List subheader={<ListSubheader>Your selections</ListSubheader>}>
        {selections
          ?.filter(s => s.contributorIri.slice(baseUrl.length) === userId)
          .map(selection => (
            <SelectionItem key={selection.iri} isUserContribution={true} refetch={refetch} selection={selection} />
          ))}
      </List>

      <List subheader={<ListSubheader>Other selections</ListSubheader>}>
        {selections
          ?.filter(s => s.contributorIri.slice(baseUrl.length) !== userId)
          .map(selection => (
            <SelectionItem key={selection.iri} isUserContribution={false} refetch={refetch} selection={selection} />
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
