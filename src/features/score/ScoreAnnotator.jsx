/** @jsxImportSource @emotion/react */

import { Assignment } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import { pink } from '@mui/material/colors'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Inspector } from './Inspector'
import { MeiViewer } from './MeiViewer'
import { Navigator } from './Navigator'

export const ScoreAnnotator = () => {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const meiUrl = useSelector(state => state.inspectedEntity.meiUrl)
  const scoreIri = useSelector(state => state.inspectedEntity.scoreIri)
  return (
    <div>
      <MeiViewer meiUrl={meiUrl} scoreIri={scoreIri} />
      <Inspector scoreIri={scoreIri} />
      {!isNavigatorOpen && (
        <Avatar
          sx={{ position: 'absolute', top: 56, left: 16, bgcolor: pink[500] }}
          onClick={() => setIsNavigatorOpen(true)}
        >
          <IconButton color="inherit">
            <Assignment />
          </IconButton>
        </Avatar>
      )}
      <Navigator isOpen={isNavigatorOpen} onClose={() => setIsNavigatorOpen(false)} />
    </div>
  )
}
