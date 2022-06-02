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

export const NoteEntity = props => {
  const { data: noteLabel } = useGetNoteInfoQuery(props.noteIri)
  const { data: selections } = useGetNoteSelectionsQuery(props.noteIri)
  const { data: annalyticalEntities } = useGetNoteAnnalyticalEntitiesQuery(props.noteIri)

  const dispatch = useDispatch()

  return noteLabel ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ noteIri: props.noteIri }))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <MusicNote />
          </ListItemIcon>
          <ListItemText primary={noteLabel} secondary={props.noteIri.slice(props.baseUrl.length)} />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Current note is in selections</ListSubheader>}>
        {selections?.map((selection, index) => (
          <ListItem key={selection.iri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ selectionIri: selection.iri }))}>
              <ListItemText primary={`Selection ${index + 1}`} secondary={selection.iri.slice(props.baseUrl.length)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List subheader={<ListSubheader>Current note is in annalytical entity</ListSubheader>}>
        {annalyticalEntities?.map(entity => (
          <ListItem key={entity.iri} disablePadding>
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri: entity.iri }))}>
              <ListItemText
                primary={
                  <>
                    Is
                    <ConceptItem conceptIri={entity.concept} />
                    in annotation entity
                  </>
                }
                secondary={entity.iri.slice(props.baseUrl.length)}
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
