import { Close, MusicNote } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteInfoQuery } from '../../../app/services/sparql'
import { setInspectedEntity, setSelectedEntity } from '../../slice/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'
import { ConceptItem } from './ConceptItem'

export const NoteItem = ({ noteIri, concepts, isEntity }) => {
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const { data: noteLabel } = useGetNoteInfoQuery(noteIri)
  const dispatch = useDispatch()
  const conceptIri = concepts?.find(e => e.entity === noteIri)?.concept

  return noteLabel ? (
    <ListItem
      disablePadding
      secondaryAction={
        <>
          {isEntity && (
            <IconButton
              onClick={() =>
                (isInspectionMode && dispatch(setInspectedEntity({ noteIri }))) ||
                (isSelectionMode && dispatch(setSelectedEntity({ noteIri })))
              }
            >
              <Close />
            </IconButton>
          )}
          {conceptIri && <ConceptItem conceptIri={conceptIri} />}
        </>
      }
    >
      <ListItemButton
        onClick={() => !isEntity && isInspectionMode && dispatch(setInspectedEntity({ noteIri }))}
        sx={isEntity && { cursor: 'default' }}
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
