import { Close, MusicNote } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useSelector } from 'react-redux'
import { useGetNoteInfoQuery } from '../../../app/services/sparql'
import { setInspectedEntity, setSelectedEntity } from '../../../app/services/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'
import { ConceptItem } from './ConceptItem'
import { withDispatch } from './withDispatch'

const BaseNoteItem = ({ noteIri, concepts, isEntity, baseUrlLength, dispatch }) => {
  const { isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const { data: noteLabel } = useGetNoteInfoQuery(noteIri)
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

export const NoteItem = withDispatch(BaseNoteItem)