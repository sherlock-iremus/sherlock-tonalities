/** @jsxImportSource @emotion/react */

import { BubbleChart, Close, HistoryEdu, RecentActors, Sell } from '@mui/icons-material'
import { Alert, AppBar, Box, Drawer, IconButton, Link, Snackbar, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getTreatise } from '../../app/treatises/treatises'
import { SearchBar } from './navigator/SearchBar'
import { COLOR_NAVIGATE } from './mei.css'
import { Classes } from './navigator/Classes'
import { Properties } from './navigator/Properties'
import { Selections } from './navigator/Selections'
import { Contributors } from './navigator/Contributors'
import { useDispatch } from 'react-redux'
import { setNavigatorPopup, setNavigatorSelectedTab } from '../../app/services/scoreSlice'

export const NavigatorTab = {
  SELECTIONS: 0,
  CONTRIBUTORS: 1,
  CLASSES: 2,
  PROPERTIES: 3
}

export const Navigator = props => {
  const { treatiseIri, navigator, analyticalEntityEditor } = useSelector(state => state.score)
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('')
  const treatise = getTreatise(treatiseIri)

  useEffect(() => {
    if (analyticalEntityEditor.focusedEntityIri) {
      dispatch(setNavigatorPopup('Select a property to tag your note'))
      dispatch(setNavigatorSelectedTab(NavigatorTab.PROPERTIES))
    }
  }, [analyticalEntityEditor.focusedEntityIri, dispatch])

  return ( <>
    <Drawer open={props.isOpen} anchor="left" variant="persistent">
      <Box sx={{ width: 450 }}>
        <AppBar position="sticky" sx={{ bgcolor: COLOR_NAVIGATE }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Navigator
            </Typography>
            {!(navigator.tab === NavigatorTab.SELECTIONS) && <SearchBar value={filter} onChange={e => setFilter(e.target.value)} />}
            <Tooltip title="Close">
              <IconButton edge="end" color="inherit" onClick={props.onClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Tabs
            value={navigator.tab}
            onChange={(e, newTab) => dispatch(setNavigatorSelectedTab(newTab))}
            textColor="inherit"
            centered
            sx={{ '& .MuiTabs-indicator': { backgroundColor: 'white' } }}
          >
            <Tab icon={<BubbleChart />} label="Selections" />
            <Tab icon={<RecentActors />} label="Contributors" />
            <Tab icon={<HistoryEdu />} label="Concepts" />
            <Tab icon={<Sell />} label="Properties" />
          </Tabs>
        </AppBar>
        {navigator.tab === NavigatorTab.SELECTIONS && <Selections scoreIri={props.scoreIri} />}
        {navigator.tab === NavigatorTab.CONTRIBUTORS && <Contributors />}
        {navigator.tab === NavigatorTab.CLASSES && <Classes treatise={treatise} filter={filter} />}
        {navigator.tab === NavigatorTab.PROPERTIES && <Properties treatise={treatise} filter={filter} />}
      </Box>
    </Drawer>
        <Snackbar
        open={navigator.popup}
        autoHideDuration={3000}
        onClose={() => dispatch(setNavigatorPopup(null))}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ mr: 8, mt: 1 }}
      >
        <Alert sx={{ backgroundColor: 'green'}} variant="filled" severity="info" onClose={() => dispatch(setNavigatorPopup(null))}>
          <Link onClick={props.onChange} underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
            {navigator.popup}
          </Link>
        </Alert>
      </Snackbar>
    </>
  )
}
