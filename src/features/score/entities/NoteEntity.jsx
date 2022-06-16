import { List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetNoteAnnalyticalEntitiesQuery, useGetNoteSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../slice/scoreSlice'
import { IncomingAnnotations } from '../annotations/IncomingAnnotations'
import { ConceptItem } from '../items/ConceptItem'
import { NoteItem } from '../items/NoteItem'

export const NoteEntity = ({ noteIri, baseUrl }) => {
  const dispatch = useDispatch()
  const { data: selections } = useGetNoteSelectionsQuery(noteIri)
  const { data: annalyticalEntities } = useGetNoteAnnalyticalEntitiesQuery(noteIri)
  return (
    <>
      <NoteItem {...{ noteIri }} isEntity />
      <IncomingAnnotations entityIri={noteIri} />

      {!!selections?.length && (
        <List subheader={<ListSubheader>Current note is in selections</ListSubheader>}>
          {selections?.map(({ iri: selectionIri }, index) => (
            <ListItem key={selectionIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ selectionIri }))}>
                <ListItemText primary={`Selection ${index + 1}`} secondary={selectionIri.slice(baseUrl.length)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      {!!annalyticalEntities?.length && (
        <List subheader={<ListSubheader>Current note is in annalytical entity</ListSubheader>}>
          {annalyticalEntities.map(({ iri: annotationIri, concept: conceptIri }) => (
            <ListItem key={annotationIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
                <ListItemText
                  primary={
                    <>
                      Is
                      <ConceptItem {...{ conceptIri }} />
                      in annotation entity
                    </>
                  }
                  secondary={annotationIri.slice(baseUrl.length)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}
