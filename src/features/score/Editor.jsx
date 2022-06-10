import { BubbleChart, Close, Done } from '@mui/icons-material'
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListSubheader,
  SpeedDial,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { red } from '@mui/material/colors'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectionMode } from '../slice/scoreSlice'
import { Item } from './items/Item'

export const Editor = () => {
  const dispatch = useDispatch()
  const { selectedEntities, isSelectionMode, baseUrl } = useSelector(state => state.score)
  return (
    <Drawer open={isSelectionMode} anchor="right" variant="persistent">
      <Box sx={{ width: 420 }}>
        <AppBar position="sticky" sx={{ bgcolor: red[500] }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Editor
            </Typography>
            <Tooltip title="Close">
              <IconButton edge="end" color="inherit" onClick={() => dispatch(setInspectionMode())}>
                <Close />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Toolbar>
            <Tabs value={0} textColor="inherit" indicatorColor="inherit" centered sx={{ flexGrow: 1 }}>
              <Tab label="New selection" icon={<BubbleChart />} />
            </Tabs>
          </Toolbar>
        </AppBar>
        <List subheader={<ListSubheader>Current selection</ListSubheader>}>
          {selectedEntities.map(item => (
            <Item {...item} key={item.selectionIri || item.noteIri || item.verticalityIri || item.positionnedNoteIri} baseUrl={baseUrl} />
          ))}
        </List>
        <Tooltip title="Validate">
          <SpeedDial
            ariaLabel="validate"
            sx={{ position: 'absolute', bottom: 16, right: 16, '& .MuiSpeedDial-fab': { backgroundColor: red[500] } }}
            icon={<Done />}
          />
        </Tooltip>
      </Box>
    </Drawer>
  )
}
