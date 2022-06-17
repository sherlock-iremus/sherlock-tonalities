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
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectionMode } from '../../app/services/scoreSlice'
import { Item } from './items/Item'
import { COLOR_SELECTED } from './mei.css'
import { findKey } from './utils'

export const Editor = () => {
  const dispatch = useDispatch()
  const { selectedEntities, isSelectionMode, baseUrl } = useSelector(state => state.score)
  return (
    <Drawer open={isSelectionMode} anchor="right" variant="persistent">
      <Box sx={{ width: 400 }}>
        <AppBar position="sticky" sx={{ bgcolor: COLOR_SELECTED }}>
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
            <Tabs
              value={0}
              textColor="inherit"
              centered
              sx={{ flexGrow: 1, '& .MuiTabs-indicator': { backgroundColor: COLOR_SELECTED } }}
            >
              <Tab label="New selection" icon={<BubbleChart />} />
            </Tabs>
          </Toolbar>
        </AppBar>
        <List subheader={<ListSubheader>Current selection</ListSubheader>}>
          {selectedEntities.map(item => (
            <Item {...item} key={findKey(item)} baseUrl={baseUrl} isEntity />
          ))}
        </List>
        <Tooltip title="Validate">
          <SpeedDial
            ariaLabel="validate"
            sx={{ position: 'absolute', bottom: 16, right: 16, '& .MuiSpeedDial-fab': { backgroundColor: COLOR_SELECTED } }}
            icon={<Done />}
          />
        </Tooltip>
      </Box>
    </Drawer>
  )
}
