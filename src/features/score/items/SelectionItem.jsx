import { BubbleChart, ChevronRight, Close, Edit, ExpandMore } from '@mui/icons-material'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetChildSelectionsQuery, useGetScoreSelectionsQuery } from '../../../app/services/sparql'
import { setEditingSelection, setInspectedEntity, setSelectedEntity } from '../../../app/services/scoreSlice'
import { LoadingEntity } from '../entities/LoadingEntity'
import { findKey } from '../utils'
import { ConceptItem } from './ConceptItem'
import { Item } from './Item'
import { withDispatch } from './withDispatch'
import { useGetUserIdQuery } from '../../../app/services/sherlockApi'

const BaseSelectionItem = ({
  selectionIri,
  concepts,
  isEntity,
  baseUrlLength,
  dispatch,
  initialIsOpen = true,
  secondaryAction,
  focusedEntityIri,
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const { data: userId } = useGetUserIdQuery()
  const { isInspectionMode, isSelectionMode, scoreIri } = useSelector(state => state.score)
  const { data: selections } = useGetScoreSelectionsQuery(scoreIri)
  const { data: children } = useGetChildSelectionsQuery(selectionIri)
  const contributorIri = selections.filter(s => s.iri === selectionIri)[0]?.contributorIri
  const conceptIri = concepts?.find(e => e.entityIri === selectionIri)?.propertyIri

  return children ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          secondaryAction || (
            <>
              {isEntity && (
                <>
                  {isInspectionMode && contributorIri?.slice(baseUrlLength) === userId && (
                    <IconButton onClick={() => dispatch(setEditingSelection({ selectionIri, children }))}>
                      <Edit />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() =>
                      (isInspectionMode && dispatch(setInspectedEntity({ selectionIri }))) ||
                      (isSelectionMode && dispatch(setSelectedEntity({ selectionIri })))
                    }
                  >
                    <Close />
                  </IconButton>
                </>
              )}
              {conceptIri && <ConceptItem conceptIri={conceptIri} />}
            </>
          )
        }
      >
        <IconButton disableRipple onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <ListItemButton
          onClick={() => !isEntity && isInspectionMode && dispatch(setInspectedEntity({ selectionIri }))}
          sx={isEntity && { cursor: 'default' }}
          selected={focusedEntityIri?.selectionIri === selectionIri}
        >
          <ListItemIcon>
            <BubbleChart />
          </ListItemIcon>
          <ListItemText
            primary={`Selection with ${children.length} elements`}
            secondary={selectionIri.slice(baseUrlLength)}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List sx={{ pl: 2 }} dense disablePadding>
          {children?.map(child => (
            <Item key={findKey(child)} {...child} {...{ concepts, focusedEntityIri }} />
          ))}
        </List>
      </Collapse>
    </>
  ) : (
    <LoadingEntity />
  )
}

export const SelectionItem = withDispatch(BaseSelectionItem)
