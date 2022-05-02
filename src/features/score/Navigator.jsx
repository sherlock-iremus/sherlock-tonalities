/** @jsxImportSource @emotion/react */

import { BubbleChart, Close, HistoryEdu } from '@mui/icons-material'
import { AppBar, Box, Drawer, IconButton, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material'
import { purple } from '@mui/material/colors'
import { useState } from 'react'
import { SearchBar } from '../meiviewer/SearchField'
import { ConceptTree } from './navigator/ConceptTree'

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
            <SearchBar value={filter} onChange={e => setFilter(e.target.value)} />
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
            <Tab icon={<HistoryEdu />} label="Concepts" />
          </Tabs>
        </AppBar>
        {selectedTab === 1 && <ConceptTree treatise={props.treatise} filter={filter} />}
      </Box>
    </Drawer>
  )
}
