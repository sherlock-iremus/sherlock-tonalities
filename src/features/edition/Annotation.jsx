import { Edit, Comment } from '@mui/icons-material'
import { Collapse, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ContextChip } from '../../components/ContextChip'
import { setHoveredAnnotation, setSelectedAnnotation } from '../../services/globals'
import { removeBaseIri } from '../../utils'

export const Annotation = ({ concept, date, entity, notes, page }) => {
  return (
    <ListItem
      key={date}
      disablePadding
      secondaryAction={
        <Collapse in={true} timeout="auto" unmountOnExit>
          <IconButton>
            <Edit />
          </IconButton>
          <IconButton edge="end">
            <Comment />
          </IconButton>
        </Collapse>
      }
    >
      <ListItemButton>
        <ContextChip key={concept} primary={removeBaseIri(concept)} secondary="Guillotel" sx={{ m: 0.2 }} />
        <ListItemText
          sx={{ paddingLeft: 1 }}
          //secondary={notes.length === 1 ? 'on one note' : `on ${notes.length} notes`}
        />
      </ListItemButton>
    </ListItem>
  )
}
