import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore, MoveDown, MoveUp } from '@mui/icons-material'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material'
import { useState } from 'react'
import { useGetChildSelectionsQuery, useGetParentSelectionsQuery } from '../../../app/services/sparql'
import { LoadingEntity } from './LoadingEntity'

export const SelectionEntity = props => {
  const [isChildTreeOpen, setIsChildTreeOpen] = useState(false)
  const [isParentListOpen, setIsParentListOpen] = useState(false)
  const { data: children } = useGetChildSelectionsQuery(props.selectionIri)
  const { data: parents } = useGetParentSelectionsQuery(props.selectionIri)

  return children && parents ? (
    <>
      <Collapse in={isParentListOpen} timeout="auto" unmountOnExit>
        <List dense disablePadding></List>
      </Collapse>
      <ListItem disablePadding secondaryAction={props.secondaryAction} sx={{ pl: isParentListOpen ? 4 : 2 }}>
        <IconButton onClick={() => setIsParentListOpen(!isParentListOpen)} disabled={!parents.length}>
          {isParentListOpen ? <ExpandLess /> : <ChevronLeft />}
        </IconButton>
        <IconButton onClick={() => setIsChildTreeOpen(!isChildTreeOpen)}>
          {isChildTreeOpen ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemText
            primary={`Selection with ${children.length} elements`}
            secondary={props.selectionIri.slice(props.baseUrl.length)}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={isChildTreeOpen} timeout="auto" unmountOnExit>
        <List
          sx={{ pl: isParentListOpen ? 8 : 4 }}
          dense
          disablePadding
        ></List>
      </Collapse>
    </>
  ) : (
    <LoadingEntity />
  )
}
