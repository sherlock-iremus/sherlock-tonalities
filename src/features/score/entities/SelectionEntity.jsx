import { AddComment } from '@mui/icons-material'
import { List, ListItem, ListItemButton, ListItemText, ListSubheader, SpeedDial, SpeedDialAction } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetParentSelectionsQuery } from '../../../app/services/sparql'
import { setAnalyticalEntityEditor, setAnnotationEditor, setInspectedEntity } from '../../../app/services/scoreSlice'
import { SelectionItem } from '../items/SelectionItem'
import { AnalyticalEntities } from '../annotations/AnalyticalEntities'
import { SELECTION } from '../constants'
import actions from '../../../app/services/p140_p177.json'

export const SelectionEntity = ({ selectionIri }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { data: parents } = useGetParentSelectionsQuery(selectionIri)
  return (
    <>
      <SelectionItem {...{ selectionIri }} isEntity />

      {!!parents?.length && (
        <List subheader={<ListSubheader>Parent selections</ListSubheader>} dense disablePadding>
          {parents.map((parentIri, index) => (
            <ListItem key={parentIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ parentIri }))}>
                <ListItemText primary={`Parent selection ${index + 1}`} secondary={parentIri.slice(baseUrlLength)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <AnalyticalEntities {...{ selectionIri }} />

      <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<AddComment />}>
        {actions[SELECTION].map(action => (
          <SpeedDialAction
            key={action.iri}
            onClick={() => dispatch(setAnnotationEditor({ subject: { selectionIri }, predicat: action }))}
            tooltipTitle={action.label || action.iri.slice(baseUrlLength)}
            icon={action.icon}
          />
        ))}
        <SpeedDialAction
          onClick={() =>
            dispatch(
              setAnalyticalEntityEditor({
                selectionIri,
                propertyIri: 'http://modality-tonality.huma-num.fr/Zarlino_1558#hasCadence',
              })
            )
          }
          tooltipTitle="Identify cadence"
          icon="🎼"
        />
      </SpeedDial>
    </>
  )
}
