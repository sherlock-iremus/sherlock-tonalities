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
import { useDispatch } from 'react-redux'
import { useGetParentSelectionsQuery, useGetSelectionAnalyticalEntitiesQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { SelectionItem } from '../items/SelectionItem'

export const SelectionEntity = ({ selectionIri, baseUrl }) => {
  const dispatch = useDispatch()
  const { data: parents } = useGetParentSelectionsQuery(selectionIri)
  const { data: annotations } = useGetSelectionAnalyticalEntitiesQuery(selectionIri)
  return (
    <>
      <SelectionItem {...{ selectionIri, baseUrl }} isEntity />

      {!!parents?.length && (
        <List subheader={<ListSubheader>Parent selections</ListSubheader>} dense disablePadding>
          {parents.map((parentIri, index) => (
            <ListItem key={parentIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ parentIri }))}>
                <ListItemText
                  primary={`Parent selection ${index + 1}`}
                  secondary={parentIri.slice(baseUrl.length)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {!!annotations?.length && (
        <List subheader={<ListSubheader>Analytical entities</ListSubheader>} dense disablePadding>
          {annotations.map((annotationIri, index) => (
            <ListItem key={annotationIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
                <ListItemText
                  primary={`Analytical entity ${index + 1}`}
                  secondary={annotationIri.slice(baseUrl.length)}
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
