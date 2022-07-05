import { Close, QueueMusic } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { withDispatch } from './withDispatch'
import { useGetNoteInfoQuery, useGetPositionnedNoteInfoQuery } from '../../../app/services/sparql'
import { setInspectedEntity, setSelectedEntity } from '../../../app/services/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'
import { useSelector } from 'react-redux'

const BasePositionnedNoteItem = ({ positionnedNoteIri, baseUrlLength, dispatch, isEntity }) => {
  const { isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const { data } = useGetPositionnedNoteInfoQuery(positionnedNoteIri)
  const { data: noteLabel } = useGetNoteInfoQuery(data?.attachedNoteIri, { skip: !data })
  return noteLabel ? (
    <ListItem
      disablePadding
      secondaryAction={
        isEntity && (
          <IconButton
            disableRipple
            onClick={() =>
              (isInspectionMode && dispatch(setInspectedEntity({ positionnedNoteIri }))) ||
              (isSelectionMode && dispatch(setSelectedEntity({ positionnedNoteIri })))
            }
          >
            <Close />
          </IconButton>
        )
      }
    >
      <ListItemButton
        onClick={() =>
          !isEntity &&
          ((isInspectionMode && dispatch(setInspectedEntity({ positionnedNoteIri }))) ||
            (isSelectionMode && dispatch(setSelectedEntity({ positionnedNoteIri }))))
        }
        sx={isEntity && { cursor: 'default' }}
      >
        <ListItemIcon>
          <QueueMusic />
        </ListItemIcon>
        <ListItemText primary={noteLabel} secondary={positionnedNoteIri.slice(baseUrlLength)} />
      </ListItemButton>
    </ListItem>
  ) : (
    <LoadingEntity />
  )
}

export const PositionnedNoteItem = withDispatch(BasePositionnedNoteItem)
