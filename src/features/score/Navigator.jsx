/** @jsxImportSource @emotion/react */

import { BubbleChart, Close, HistoryEdu, Lyrics } from '@mui/icons-material'
import { AppBar, Box, Drawer, IconButton, List, ListSubheader, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import { purple } from '@mui/material/colors'
import { useState } from 'react'
import { ConceptTree } from './ConceptTree'

export const Navigator = props => {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <Drawer open={props.isOpen} anchor="left" variant="persistent">
      <Box sx={{ width: 400 }}>
        <AppBar position="sticky" sx={{ bgcolor: purple[500] }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Navigator
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => props.onClose()}>
              <Close />
            </IconButton>
          </Toolbar>
          <Tabs
            value={selectedTab}
            onChange={(e, newTab) => setSelectedTab(newTab)}
            textColor="inherit"
            indicatorColor="secondary"
            centered
          >
            <Tab icon={<BubbleChart />} label="Selections" />
            <Tab icon={<Lyrics />} label="Annotations" />
            <Tab icon={<HistoryEdu />} label="Concepts" />
          </Tabs>
        </AppBar>
        {selectedTab === 2 && <ConceptTree />}
      </Box>
    </Drawer>
  )
}
