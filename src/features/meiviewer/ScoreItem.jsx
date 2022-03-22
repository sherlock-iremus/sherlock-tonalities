import { ListItem, ListItemButton, ListItemText, ListItemIcon, Collapse, List } from '@mui/material'
import { useGetNoteInfoQuery } from '../../app/services/sparqlLocal'
import { MusicNote, ExpandMore, ChevronRight } from '@mui/icons-material'
import { useState } from 'react'

export const ScoreItem = props => {
  const [isOpen, setIsOpen] = useState(false)
  const noteInfo = useGetNoteInfoQuery(`${props.scoreIri}_${props.item.id}`, {
    skip: props.item.referenceNote || props.item.selection,
  })

  const getNoteLabel = () => {
    const {
      data: {
        results: {
          bindings: [
            {
              pname: { value: pname },
              oct: { value: oct },
              accid,
            },
          ],
        },
      },
    } = noteInfo

    let alteration = ''
    if (accid) {
      switch (accid.value) {
        case 'f':
          alteration = '♭'
          break
        case 's':
          alteration = '#'
          break
        case 'n':
          alteration = '♮'
          break
      }
    }

    return pname.toUpperCase() + oct + alteration
  }

  if (props.item.selection)
    // element is a selection
    return (
      <div>
        <ListItem disablePadding secondaryAction={props.secondaryAction}>
          <ListItemButton onClick={() => setIsOpen(!isOpen)}>
            <ListItemIcon>{isOpen ? <ExpandMore /> : <ChevronRight />}</ListItemIcon>
            <ListItemText primary={props.item.id} />
          </ListItemButton>
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} dense>
            {props.item.selection.map(item => (
              <ScoreItem key={item.id} item={item} />
            ))}
          </List>
        </Collapse>
      </div>
    )
  else if (props.item.referenceNote)
    // element is a verticality
    return <ListItem />
  else if (noteInfo.isSuccess)
    // element is a note
    return (
      <ListItem disablePadding secondaryAction={props.secondaryAction}>
        <ListItemButton>
          <ListItemIcon>
            <MusicNote />
          </ListItemIcon>
          <ListItemText primary="test" secondary={props.item.id} />
        </ListItemButton>
      </ListItem>
    )
  return <div />
}
