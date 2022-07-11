import { List, ListItem, ListItemButton, ListItemText, ListSubheader, SpeedDial, SpeedDialAction } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteSelectionsQuery } from '../../../app/services/sparql'
import { setAnnotationEditor, setInspectedEntity } from '../../../app/services/scoreSlice'
import { NoteItem } from '../items/NoteItem'
import { NOTE } from '../constants'
import actions from '../../../app/services/p140_p177.json'
import { AddComment } from '@mui/icons-material'
import { OutgoingAnnotations } from '../annotations/OutgoingAnnotations'
import { AnalyticalEntities } from '../annotations/AnalyticalEntities'

export const NoteEntity = ({ noteIri }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { data: selections } = useGetNoteSelectionsQuery(noteIri)
  const { treatiseIri } = useSelector(state => state.score)
  const filteredActions = [
    ...(treatiseIri in actions[NOTE] ? actions[NOTE][treatiseIri] : []),
    ...actions[NOTE].common,
  ]
  return (
    <>
      <NoteItem {...{ noteIri }} isEntity />

      {!!selections?.length && (
        <List subheader={<ListSubheader>Current note is in selections</ListSubheader>} dense disablePadding>
          {selections?.map(({ iri: selectionIri }, index) => (
            <ListItem key={selectionIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ selectionIri }))}>
                <ListItemText primary={`Selection ${index + 1}`} secondary={selectionIri.slice(baseUrlLength)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <AnalyticalEntities {...{ noteIri }} />

      <OutgoingAnnotations {...{ noteIri }} />

      <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<AddComment />}>
        {filteredActions.map(action => (
          <SpeedDialAction
            key={action.iri}
            onClick={() => dispatch(setAnnotationEditor({ subject: { noteIri }, predicat: action }))}
            tooltipTitle={action.label || action.iri.slice(baseUrlLength)}
            icon={action.icon}
          />
        ))}
      </SpeedDial>
    </>
  )
}
