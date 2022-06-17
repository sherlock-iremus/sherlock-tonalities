import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteAnnalyticalEntitiesQuery, useGetNoteSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { IncomingAnnotations } from '../annotations/IncomingAnnotations'
import { ConceptItem } from '../items/ConceptItem'
import { NoteItem } from '../items/NoteItem'

export const NoteEntity = ({ noteIri }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrlLength)
  const { data: selections } = useGetNoteSelectionsQuery(noteIri)
  const { data: analyticalEntities } = useGetNoteAnnalyticalEntitiesQuery(noteIri)
  return (
    <>
      <NoteItem {...{ noteIri }} isEntity />
      
      <IncomingAnnotations entityIri={noteIri} />

      {!!selections?.length && (
        <List subheader={<ListSubheader>Current note is in selections</ListSubheader>}>
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
        <List subheader={<ListSubheader>Current note is in annalytical entity</ListSubheader>}>
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
    </>
  )
}
