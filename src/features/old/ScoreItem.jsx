import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  List,
  Skeleton,
  IconButton,
  Tooltip,
  Chip,
  ListSubheader,
} from '@mui/material'
import { useGetNoteInfoQuery, useGetAnnotationInfoQuery, useGetSubAnnotationsQuery } from '../../app/services/sparql'
import {
  MusicNote,
  ExpandMore,
  ChevronRight,
  Sell,
  AlignHorizontalCenter,
  HighlightAlt,
  QueueMusic,
} from '@mui/icons-material'
import { useState } from 'react'

export const ScoreItem = props => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: noteLabel } = useGetNoteInfoQuery(`${props.scoreIri}_${props.item.id}`, {
    skip: props.item.referenceNote || props.item.selection || props.item.annotation,
  })
  const { data: concepts } = useGetAnnotationInfoQuery(props.item.id, { skip: !props.item.annotation })
  const { data: subAnnotations } = useGetSubAnnotationsQuery(props.item.id, { skip: !props.item.annotation })

  if (props.item.annotation && concepts && subAnnotations)
    return (
      <>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary={concepts.map(concept => (
                <Chip key={concept} label={concept.slice(props.treatiseIri.length)} sx={{ m: 0.3 }} />
              ))}
              secondary={props.item.id}
            />
          </ListItemButton>
        </ListItem>
        <List sx={{ pl: 2 }} dense disablePadding subheader={<ListSubheader>Associated selection</ListSubheader>}>
          {subAnnotations.map(subAnnotation => (
            <ScoreItem
              disablePadding
              key={subAnnotation.entity}
              item={{ id: subAnnotation.entity.slice(props.scoreIri.length + 1) }}
              scoreIri={props.scoreIri}
              secondaryAction={<Chip label={subAnnotation.concept.slice(props.treatiseIri.length)} />}
            />
          ))}
        </List>
      </>
    )

  if (props.labelOnly && noteLabel) return noteLabel

  if (props.item.noteOnBeat)
    // element is a noteOnBeat
    return (
      <ListItem disablePadding secondaryAction={props.secondaryAction}>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <QueueMusic />
          </ListItemIcon>
          <ListItemText
            primary={<ScoreItem item={props.item.selection[0]} scoreIri={props.scoreIri} labelOnly />}
            secondary={props.item.id}
          />
        </ListItemButton>
      </ListItem>
    )

  if (props.item.selection)
    // element is a selection or a verticality
    return (
      <div>
        <ListItem disablePadding secondaryAction={props.secondaryAction}>
          <ListItemButton onClick={() => setIsOpen(!isOpen)} sx={{ cursor: 'default' }}>
            <ListItemIcon>{props.item.referenceNote ? <AlignHorizontalCenter /> : <Sell />}</ListItemIcon>
            <IconButton disableRipple sx={{ cursor: 'default' }}>
              {isOpen ? <ExpandMore /> : <ChevronRight />}
            </IconButton>
            <ListItemText primary={props.item.name ? props.item.name : 'Verticality'} secondary={props.item.id} />
          </ListItemButton>
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List sx={{ pl: 4 }} dense disablePadding>
            {props.item.selection.map(item => (
              <ScoreItem
                key={item.id}
                item={item}
                scoreIri={props.scoreIri}
                secondaryAction={
                  props.item.referenceNote && (
                    <IconButton onClick={() => props.onNoteSelect(item)}>
                      <Tooltip title="Inspect note on beat">
                        <HighlightAlt />
                      </Tooltip>
                    </IconButton>
                  )
                }
              />
            ))}
          </List>
        </Collapse>
      </div>
    )
  // element is a note
  else if (noteLabel)
    return (
      <ListItem disablePadding secondaryAction={props.secondaryAction}>
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <MusicNote />
          </ListItemIcon>
          <ListItemText primary={noteLabel} secondary={props.item.id} />
        </ListItemButton>
      </ListItem>
    )

  // element is loading
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ cursor: 'default' }}>
        <ListItemIcon>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemIcon>
        <ListItemText
          primary={<Skeleton width="75%" heigth="100%" />}
          secondary={<Skeleton width="50%" heigth="100%" />}
        />
      </ListItemButton>
    </ListItem>
  )
}
