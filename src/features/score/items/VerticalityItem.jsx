import { AlignHorizontalCenter, ChevronRight, Close, ExpandMore } from '@mui/icons-material'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetVerticalityPositionnedNotesQuery } from '../../../app/services/sparql'
import { setInspectedEntity, setSelectedEntity } from '../../../app/services/scoreSlice'
import { PositionnedNoteItem } from './PositionnedNoteItem'
import { ConceptItem } from './ConceptItem'
import { LoadingEntity } from '../entities/LoadingEntity'

export const VerticalityItem = ({
  verticalityIri,
  clickedNoteIri,
  isEntity,
  concepts,
  secondaryAction,
  initialIsOpen = true,
  focusedEntityIri,
}) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(initialIsOpen)
  const { isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { data: positionnedNotes } = useGetVerticalityPositionnedNotesQuery(verticalityIri)
  const conceptIri = concepts?.find(e => e.entityIri === verticalityIri)?.propertyIri
  return positionnedNotes ? (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          secondaryAction || (
            <>
              {isEntity && (
                <IconButton
                  onClick={() =>
                    (isInspectionMode && dispatch(setInspectedEntity({ verticalityIri }))) ||
                    (isSelectionMode && dispatch(setSelectedEntity({ verticalityIri })))
                  }
                >
                  <Close />
                </IconButton>
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
          onClick={() => !isEntity && isInspectionMode && dispatch(setInspectedEntity({ verticalityIri }))}
          sx={isEntity && { cursor: 'default' }}
          selected={focusedEntityIri.verticalityIri === verticalityIri}
        >
          <ListItemIcon>
            <AlignHorizontalCenter />
          </ListItemIcon>
          <ListItemText
            primary={`Verticality ${verticalityIri.slice(baseUrlLength + 42)}`}
            secondary={verticalityIri.slice(baseUrlLength)}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List sx={{ pl: 2 }} dense disablePadding>
          {positionnedNotes.map(e => (
            <PositionnedNoteItem
              key={e.positionnedNoteIri}
              positionnedNoteIri={e.positionnedNoteIri}
              attachedNoteIri={e.attachedNoteIri}
              clickedNoteIri={clickedNoteIri}
              focusedEntityIri={focusedEntityIri}
            />
          ))}
        </List>
      </Collapse>
    </>
  ) : (
    <LoadingEntity />
  )
}
