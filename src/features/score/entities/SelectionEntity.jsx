import { Lyrics, Timeline } from '@mui/icons-material'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetParentSelectionsQuery, useGetSelectionAnalyticalEntitiesQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { SelectionItem } from '../items/SelectionItem'

export const SelectionEntity = ({ selectionIri }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { data: parents } = useGetParentSelectionsQuery(selectionIri)
  const { data: analyticalEntities } = useGetSelectionAnalyticalEntitiesQuery(selectionIri)
  return (
    <>
      <SelectionItem {...{ selectionIri }} isEntity />

      {!!parents?.length && (
        <List subheader={<ListSubheader>Parent selections</ListSubheader>} dense disablePadding>
          {parents.map((parentIri, index) => (
            <ListItem key={parentIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ parentIri }))}>
                <ListItemText
                  primary={`Parent selection ${index + 1}`}
                  secondary={parentIri.slice(baseUrlLength)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {!!analyticalEntities?.length && (
        <List subheader={<ListSubheader>Analytical entities</ListSubheader>} dense disablePadding>
          {analyticalEntities.map((analyticalEntityIri, index) => (
            <ListItem key={analyticalEntityIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ analyticalEntityIri }))}>
                <ListItemText
                  primary={`Analytical entity ${index + 1}`}
                  secondary={analyticalEntityIri.slice(baseUrlLength)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <Tooltip title="Create analytical entity">
        <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
          <SpeedDialAction tooltipTitle="Annotate a cadence" icon={<Timeline />} />
          <SpeedDialAction icon={<Lyrics />} tooltipTitle="Create arbitrary analytical entity" />
        </SpeedDial>
      </Tooltip>
    </>
  )
}
