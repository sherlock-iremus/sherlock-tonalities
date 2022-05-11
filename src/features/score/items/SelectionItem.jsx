import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'

export const SelectionItem = props => {
  const [isOpen, setIsOpen] = useState(false)

  const dispatch = useDispatch()

  return (
    <>
      <ListItem disablePadding secondaryAction={props.secondaryAction}>
        <IconButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? <ExpandMore /> : <ChevronRight />}</IconButton>
        <ListItemButton onClick={() => dispatch(setInspectedSelection(selection.iri))}>
          <ListItemText primary={props.selection.created} secondary={props.selection.entities + ' elements'} />
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List sx={{ pl: 4 }} dense disablePadding></List>
      </Collapse>
    </>
  )
}
