import { BubbleChart, Close, ExpandLess, ExpandMore, Lyrics, Timeline } from '@mui/icons-material'
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
} from '@mui/material'
import { red } from '@mui/material/colors'
import { Box } from '@mui/system'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetChildSelectionsQuery, useGetParentSelectionsQuery } from '../../../app/services/sparql'
import { setInspectedSelection } from '../../slice/scoreSlice'
import { Item } from '../items/Item'
import { LoadingEntity } from './LoadingEntity'

export const SelectionEntity = props => {
  const [isChildTreeOpen, setIsChildTreeOpen] = useState(false)
  const [isParentListOpen, setIsParentListOpen] = useState(false)
  const { data: children } = useGetChildSelectionsQuery(props.selectionIri)
  const { data: parents } = useGetParentSelectionsQuery(props.selectionIri)
  const dispatch = useDispatch()

  return children && parents ? (
    <>
      <Collapse in={isParentListOpen} timeout="auto" unmountOnExit>
        <List subheader={<ListSubheader>Parent selections</ListSubheader>} dense disablePadding>
          {parents.map((parentIri, index) => (
            <ListItem key={parentIri} disablePadding>
              <ListItemButton onClick={() => dispatch(setInspectedSelection(parentIri))}>
                <ListItemText
                  primary={`Parent selection ${index + 1}`}
                  secondary={parentIri.slice(props.baseUrl.length)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip title="Parent selections">
          <IconButton onClick={() => setIsParentListOpen(!isParentListOpen)}>
            {isParentListOpen ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
        </Tooltip>
      </Box>

      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disableRipple onClick={() => dispatch(setInspectedSelection(props.selectionIri))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <BubbleChart />
          </ListItemIcon>
          <ListItemText
            primary={`Selection with ${children.length} elements`}
            secondary={props.selectionIri.slice(props.baseUrl.length)}
          />
        </ListItemButton>
      </ListItem>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip title="Child selections">
          <IconButton onClick={() => setIsChildTreeOpen(!isChildTreeOpen)}>
            {isChildTreeOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={isChildTreeOpen} timeout="auto" unmountOnExit>
        <List subheader={<ListSubheader>Child selections</ListSubheader>} dense disablePadding>
          {children.map(child => (
            <Item {...child} key={child.selectionIri || child.noteIri} baseUrl={props.baseUrl} />
          ))}
        </List>
      </Collapse>

      <Tooltip title="Create analytical entity">
        <SpeedDial
          ariaLabel="New"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction tooltipTitle="Annotate a cadence" icon={<Timeline />} />
          <SpeedDialAction icon={<Lyrics />} tooltipTitle="Create arbitrary analytical entity" />
        </SpeedDial>
      </Tooltip>
    </>
  ) : (
    <LoadingEntity />
  )
}
