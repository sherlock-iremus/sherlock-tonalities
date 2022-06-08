import { MusicNote } from '@mui/icons-material'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteInfoQuery } from '../../../app/services/sparql'
import { setHoverEntity, setInspectedEntity } from '../../slice/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'
import { ConceptItem } from './ConceptItem'

export const NoteItem = ({ noteIri, concepts }) => {
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { isInspectorMode } = useSelector(state => state.score)
  const { data: noteLabel } = useGetNoteInfoQuery(noteIri)
  const dispatch = useDispatch()
  const conceptIri = concepts?.find(e => e.entity === noteIri)?.concept

  return noteLabel ? (
    <ListItem disablePadding secondaryAction={conceptIri && <ConceptItem conceptIri={conceptIri} />}>
      <ListItemButton
        onClick={() => isInspectorMode && dispatch(setInspectedEntity({ noteIri }))}
        onMouseEnter={() => dispatch(setHoverEntity({ noteIri }))}
        onMouseLeave={() => dispatch(setHoverEntity({ noteIri }))}
      >
        <ListItemIcon>
          <MusicNote />
        </ListItemIcon>
        <ListItemText primary={noteLabel} secondary={noteIri.slice(baseUrlLength)} />
      </ListItemButton>
    </ListItem>
  ) : (
    <LoadingEntity />
  )
}
