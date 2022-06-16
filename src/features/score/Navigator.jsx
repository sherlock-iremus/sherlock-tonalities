/** @jsxImportSource @emotion/react */

import { BubbleChart, Close, HistoryEdu, Piano, Sell } from '@mui/icons-material'
import { AppBar, Box, Drawer, IconButton, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material'
import { purple } from '@mui/material/colors'
import { useState } from 'react'
import { SearchBar } from '../meiviewer/SearchField'
import { Classes } from './navigator/Classes'
import { Properties } from './navigator/Properties'
import { Selections } from './navigator/Selections'

export const Navigator = props => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [filter, setFilter] = useState('')

  return (
    <Drawer open={props.isOpen} anchor="left" variant="persistent">
      <Box sx={{ width: 400 }}>
        <AppBar position="sticky" sx={{ bgcolor: purple[500] }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Navigator
            </Typography>
            <SearchBar
              value={filter}
              onChange={e => setFilter(e.target.value)}
              disabled={!(selectedTab === 1 || selectedTab === 2)}
            />
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
            indicatorColor="secondary"
            centered
          >
            <Tab icon={<BubbleChart />} label="Selections" />
            <Tab icon={<HistoryEdu />} label="Classes" />
            <Tab icon={<Sell />} label="Properties" />
          </Tabs>
        </AppBar>
        {selectedTab === 0 && <Selections scoreIri={props.scoreIri} baseUrl={props.baseUrl} />}
        {selectedTab === 1 && <Classes treatise={props.treatise} filter={filter} />}
        {selectedTab === 2 && <Properties treatise={props.treatise} filter={filter} />}
      </Box>
    </Drawer>
  )
}
