import { Close, Comment } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useSelector } from 'react-redux'
import { setInspectedEntity, setSelectedEntity } from '../../../app/services/scoreSlice'
import { withDispatch } from './withDispatch'

const BaseAnnotationItem = ({ annotationIri, isEntity, baseUrlLength, dispatch }) => {
  const { isInspectionMode, isSelectionMode } = useSelector(state => state.score)

  return (
    <ListItem
      disablePadding
      secondaryAction={
        isEntity && (
          <IconButton
            onClick={() =>
              (isInspectionMode && dispatch(setInspectedEntity({ annotationIri }))) ||
              (isSelectionMode && dispatch(setSelectedEntity({ annotationIri })))
            }
          >
            <Close />
          </IconButton>
        )
      }
    >
      <ListItemButton
        onClick={() => !isEntity && isInspectionMode && dispatch(setInspectedEntity({ annotationIri }))}
        sx={isEntity && { cursor: 'default' }}
      >
        <ListItemIcon>
          <Comment />
        </ListItemIcon>
        <ListItemText primary="Annotation" secondary={annotationIri.slice(baseUrlLength)} />
      </ListItemButton>
    </ListItem>
  )
}

export const AnnotationItem = withDispatch(BaseAnnotationItem)
