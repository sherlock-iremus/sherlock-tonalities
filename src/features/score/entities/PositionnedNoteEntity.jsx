import { List, ListItem, ListItemButton, ListItemText, ListSubheader, SpeedDial, SpeedDialAction } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  useGetNoteAnnalyticalEntitiesQuery,
  useGetNoteSelectionsQuery,
  useGetPositionnedNoteInfoQuery,
} from '../../../app/services/sparql'
import { setAnnotationEditor, setInspectedEntity } from '../../../app/services/scoreSlice'
import { ConceptItem } from '../items/ConceptItem'
import { NoteItem } from '../items/NoteItem'
import { VerticalityItem } from '../items/VerticalityItem'
import { NOTE } from '../constants'
import actions from '../../../app/services/p140_p177.json'
import { AddComment } from '@mui/icons-material'
import { OutgoingAnnotations } from '../annotations/OutgoingAnnotations'
import { PositionnedNoteItem } from '../items/PositionnedNoteItem'

export const PositionnedNoteEntity = ({ positionnedNoteIri }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { data } = useGetPositionnedNoteInfoQuery(positionnedNoteIri)
  const { data: selections } = useGetNoteSelectionsQuery(positionnedNoteIri)
  const { data: analyticalEntities } = useGetNoteAnnalyticalEntitiesQuery(positionnedNoteIri)
  return (
    <>
      <PositionnedNoteItem {...{ positionnedNoteIri }} isEntity />

      <List subheader={<ListSubheader>Corresponding verticality</ListSubheader>} dense disablePadding>
          <VerticalityItem verticalityIri={data.verticalityIri} initialIsOpen={false} />
      </List>

      <List subheader={<ListSubheader>Corresponding note</ListSubheader>} dense disablePadding>
          <NoteItem noteIri={data.attachedNoteIri} />
      </List>

      <OutgoingAnnotations {...{ positionnedNoteIri }} />

      {!!selections?.length && (
        <List subheader={<ListSubheader>Current positionned note is in selections</ListSubheader>} dense disablePadding>
          {selections?.map(({ iri: selectionIri }, index) => (
            <ListItem key={selectionIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ selectionIri }))}>
                <ListItemText primary={`Selection ${index + 1}`} secondary={selectionIri.slice(baseUrlLength)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {!!analyticalEntities?.length && (
        <List
          subheader={<ListSubheader>Current positionned note is in analytical entity</ListSubheader>}
          dense
          disablePadding
        >
          {analyticalEntities.map(({ iri: analyticalEntityIri, concept: conceptIri }) => (
            <ListItem key={analyticalEntityIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ analyticalEntityIri }))}>
                <ListItemText
                  primary={
                    <>
                      <ConceptItem {...{ conceptIri }} />
                      in analytical entity
                    </>
                  }
                  secondary={analyticalEntityIri.slice(baseUrlLength)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<AddComment />}>
        {actions[NOTE].map(action => (
          <SpeedDialAction
            key={action.iri}
            onClick={() => dispatch(setAnnotationEditor({ subject: { positionnedNoteIri }, predicat: action }))}
            tooltipTitle={action.label || action.iri.slice(baseUrlLength)}
            icon={action.icon}
          />
        ))}
      </SpeedDial>
    </>
  )
}
