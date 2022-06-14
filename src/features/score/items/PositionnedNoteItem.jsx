import { Close, QueueMusic } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { withDispatch } from './withDispatch'
import { useGetNoteInfoQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../slice/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'

const BasePositionnedNoteItem = ({
  positionnedNoteIri,
  attachedNoteIri,
  clickedNoteIri,
  baseUrlLength,
  dispatch,
  isEntity,
}) => {
  const { data: noteLabel } = useGetNoteInfoQuery(attachedNoteIri)
  return noteLabel ? (
    <ListItem
      disablePadding
      secondaryAction={
        isEntity && (
          <IconButton disableRipple onClick={() => dispatch(setInspectedEntity({ positionnedNoteIri }))}>
            <Close />
          </IconButton>
        )
      }
    >
      <ListItemButton
        onClick={() =>
          !isEntity &&
          dispatch(
            setInspectedEntity({
              positionnedNoteIri,
              attachedNoteIri,
              clickedNoteIri,
            })
          )
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
