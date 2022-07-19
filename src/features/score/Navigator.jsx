/** @jsxImportSource @emotion/react */

import { BubbleChart, Close, HistoryEdu, RecentActors, Sell } from '@mui/icons-material'
import { AppBar, Box, Drawer, IconButton, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getTreatise } from '../../app/treatises/treatises'
import { SearchBar } from './navigator/SearchBar'
import { COLOR_NAVIGATE } from './mei.css'
import { Classes } from './navigator/Classes'
import { Properties } from './navigator/Properties'
import { Selections } from './navigator/Selections'
import { Contributors } from './navigator/Contributors'

export const Navigator = props => {
  const [selectedTab, setSelectedTab] = useState(0)
  const { treatiseIri } = useSelector(state => state.score)
  const [filter, setFilter] = useState('')
  const treatise = getTreatise(treatiseIri)

  return (
    <Drawer open={props.isOpen} anchor="left" variant="persistent">
      <Box sx={{ width: 400 }}>
        <AppBar position="sticky" sx={{ bgcolor: COLOR_NAVIGATE }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Navigator
            </Typography>
            {!(selectedTab === 0) && <SearchBar value={filter} onChange={e => setFilter(e.target.value)} />}
            <Tooltip title="Close">
              <IconButton edge="end" color="inherit" onClick={props.onClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Tabs
            value={selectedTab}
            onChange={(e, newTab) => setSelectedTab(newTab)}
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
        {selectedTab === 0 && <Selections scoreIri={props.scoreIri} />}
        {selectedTab === 1 && <Contributors />}
        {selectedTab === 2 && <Classes treatise={treatise} filter={filter} />}
        {selectedTab === 3 && <Properties treatise={treatise} filter={filter} />}
      </Box>
    </Drawer>
  )
}
