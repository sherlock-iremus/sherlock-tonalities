import { QueueMusic } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useGetNoteInfoQuery } from '../../../app/services/sparql'
import { setInspectedPositionnedNote } from '../../slice/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'
import { ConceptItem } from './ConceptItem'

export const PositionnedNoteItem = props => {
  const dispatch = useDispatch()
  const { data: noteLabel } = useGetNoteInfoQuery(props.attachedNoteIri)
  const conceptIri = props.concepts?.find(e => e.entity === props.positionnedNoteIri)?.concept

  return noteLabel ? (
    <ListItem disablePadding secondaryAction={conceptIri && <ConceptItem conceptIri={conceptIri} />}>
      <ListItemButton
        onClick={() =>
          dispatch(
            setInspectedPositionnedNote({
              positionnedNoteIri: props.positionnedNoteIri,
              attachedNoteIri: props.attachedNoteIri,
            })
          )
        }
      >
        <ListItemIcon>
          <QueueMusic />
        </ListItemIcon>
        <ListItemText primary={noteLabel} secondary={props.positionnedNoteIri.slice(props.baseUrl.length)} />
      </ListItemButton>
    </ListItem>
  ) : (
    <LoadingEntity />
  )
}
