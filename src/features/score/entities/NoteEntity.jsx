import { Close, MusicNote } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { useDispatch } from 'react-redux'
import {
  useGetNoteAnnalyticalEntitiesQuery,
  useGetNoteInfoQuery,
  useGetNoteSelectionsQuery,
} from '../../../app/services/sparql'
import { setInspectedEntity } from '../../slice/scoreSlice'
import { ConceptItem } from '../items/ConceptItem'
import { LoadingEntity } from './LoadingEntity'

export const NoteEntity = ({ noteIri, baseUrl }) => {
  const { data: noteLabel } = useGetNoteInfoQuery(noteIri)
  const { data: selections } = useGetNoteSelectionsQuery(noteIri)
  const { data: annalyticalEntities } = useGetNoteAnnalyticalEntitiesQuery(noteIri)

  const dispatch = useDispatch()

  return noteLabel ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ noteIri }))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <MusicNote />
          </ListItemIcon>
          <ListItemText primary={noteLabel} secondary={noteIri.slice(baseUrl.length)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Current note is in selections</ListSubheader>}>
        {selections?.map(({ iri: selectionIri }, index) => (
          <ListItem key={selectionIri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ selectionIri }))}>
              <ListItemText primary={`Selection ${index + 1}`} secondary={selectionIri.slice(baseUrl.length)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List subheader={<ListSubheader>Current note is in annalytical entity</ListSubheader>}>
        {annalyticalEntities?.map(({ iri: annotationIri, concept: conceptIri }) => (
          <ListItem key={annotationIri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
              <ListItemText
                primary={
                  <>
                    Is
                    <ConceptItem {...{conceptIri}} />
                    in annotation entity
                  </>
                }
                secondary={annotationIri.slice(baseUrl.length)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  ) : (
    <LoadingEntity />
  )
}
