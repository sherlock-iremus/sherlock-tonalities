import { MusicNote } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteInfoQuery } from '../../../app/services/sparql'
import { setHoverEntity, setInspectedEntity } from '../../slice/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'
import { ConceptItem } from './ConceptItem'

export const NoteItem = props => {
  const { isInspectorMode } = useSelector(state => state.score)
  const { data: noteLabel } = useGetNoteInfoQuery(props.noteIri)
  const dispatch = useDispatch()
  const conceptIri = props.concepts?.find(e => e.entity === props.noteIri)?.concept

  return noteLabel ? (
    <ListItem disablePadding secondaryAction={conceptIri && <ConceptItem conceptIri={conceptIri} />}>
      <ListItemButton
        onClick={() => isInspectorMode && dispatch(setInspectedEntity({ noteIri: props.noteIri }))}
        onMouseEnter={() => dispatch(setHoverEntity({ noteIri: props.noteIri }))}
        onMouseLeave={() => dispatch(setHoverEntity({ noteIri: props.noteIri }))}
      >
        <ListItemIcon>
          <MusicNote />
        </ListItemIcon>
        <ListItemText primary={noteLabel} secondary={props.noteIri.slice(props.baseUrl.length)} />
      </ListItemButton>
    </ListItem>
  ) : (
    <LoadingEntity />
  )
}
