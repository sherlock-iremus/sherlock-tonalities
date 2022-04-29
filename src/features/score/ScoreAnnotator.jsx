/** @jsxImportSource @emotion/react */

import { Assignment, Info } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import { blue, purple } from '@mui/material/colors'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Inspector } from './Inspector'
import { MeiViewer } from './MeiViewer'
import { Navigator } from './Navigator'

import treatise from '../../app/treatises/Zarlino_1588.json'

export const ScoreAnnotator = () => {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)

  const meiUrl = useSelector(state => state.inspectedEntity.meiUrl)
  const scoreIri = useSelector(state => state.inspectedEntity.scoreIri)
  const treatiseIri = treatise.iri

  return (
    <>
      <MeiViewer meiUrl={meiUrl} scoreIri={scoreIri} />

      {!isInspectorOpen && (
        <Avatar
          sx={{ position: 'absolute', top: 56, right: 16, bgcolor: blue[500] }}
          onClick={() => setIsInspectorOpen(true)}
        >
          <IconButton color="inherit">
            <Info />
          </IconButton>
        </Avatar>
      )}
      <Inspector isOpen={isInspectorOpen} onClose={() => setIsInspectorOpen(false)} scoreIri={scoreIri} />

      {!isNavigatorOpen && (
        <Avatar
          sx={{ position: 'absolute', top: 56, left: 16, bgcolor: purple[500] }}
          onClick={() => setIsNavigatorOpen(true)}
        >
          <IconButton color="inherit">
            <Assignment />
          </IconButton>
        </Avatar>
      )}
      <Navigator isOpen={isNavigatorOpen} onClose={() => setIsNavigatorOpen(false)} treatise={treatise} />
    </>
  )
}
