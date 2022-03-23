import { ListItem, ListItemButton, ListItemText, ListItemIcon, Collapse, List } from '@mui/material'
import { useGetNoteInfoQuery } from '../../app/services/sparqlLocal'
import { MusicNote, ExpandMore, ChevronRight, Sell, QueueMusic } from '@mui/icons-material'
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
    // element is a selection or a verticality
    return (
      <div>
        <ListItem disablePadding secondaryAction={props.secondaryAction}>
          <ListItemButton onClick={() => setIsOpen(!isOpen)}>
            <ListItemIcon>{props.item.referenceNote ? <QueueMusic /> : <Sell />}</ListItemIcon>
            {isOpen ? <ExpandMore /> : <ChevronRight />}
            <ListItemText
              primary={props.item.referenceNote ? 'A verticality' : 'My amazing selection'}
              secondary={props.item.id}
            />
          </ListItemButton>
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} dense>
            {props.item.selection.map(item => (
              <ScoreItem key={item.id} item={item} scoreIri={props.scoreIri} />
            ))}
          </List>
        </Collapse>
      </div>
    )
  // element is a note
  else if (noteInfo.isSuccess)
    return (
      <ListItem disablePadding secondaryAction={props.secondaryAction}>
        <ListItemButton>
          <ListItemIcon>
            <MusicNote />
          </ListItemIcon>
          <ListItemText primary={getNoteLabel()} secondary={props.item.id} />
        </ListItemButton>
      </ListItem>
    )
  return (
    <ListItem disablePadding>
      <ListItemIcon>
        <MusicNote />
      </ListItemIcon>
      <ListItemText primary="..." />
    </ListItem>
  )
}
