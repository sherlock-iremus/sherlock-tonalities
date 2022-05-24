import { BubbleChart, ChevronRight, ExpandMore } from '@mui/icons-material'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetChildSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedSelection } from '../../slice/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'
import { ConceptItem } from './ConceptItem'
import { Item } from './Item'

export const SelectionItem = props => {
  const [isOpen, setIsOpen] = useState(true)
  const { data: children } = useGetChildSelectionsQuery(props.selectionIri)
  const dispatch = useDispatch()
  const conceptIri = props.concepts?.find(e => e.entity === props.selectionIri)?.concept

  return children ? (
    <>
      <ListItem disablePadding secondaryAction={conceptIri && <ConceptItem conceptIri={conceptIri} />}>
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <ListItemButton onClick={() => dispatch(setInspectedSelection(props.selectionIri))}>
          <ListItemIcon>
            <BubbleChart />
          </ListItemIcon>
          <ListItemText
            primary={`Selection with ${children.length} elements`}
            secondary={props.selectionIri.slice(props.baseUrl.length)}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List sx={{ pl: 2 }} dense disablePadding>
          {children?.map(child => (
            <Item
              {...child}
              key={child.selectionIri || child.noteIri}
              concepts={props?.concepts}
              baseUrl={props.baseUrl}
            />
          ))}
        </List>
      </Collapse>
    </>
  ) : <LoadingEntity/>
}
