/** @jsxImportSource @emotion/react */

import { Add, ArrowBack, Assignment, Home, Info, Lyrics } from '@mui/icons-material'
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Inspector } from './Inspector'
import { MeiViewer } from './MeiViewer'
import { Navigator } from './Navigator'
import treatise from '../../app/treatises/Zarlino_1588.json'
import { setSelectionMode, setTreatise } from '../slice/scoreSlice'
import { green, purple, red } from '@mui/material/colors'
import { Editor } from './Editor'
import { usePostSelectionQuery } from '../../app/services/sherlockApi'

export const ScoreAnnotator = () => {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const { data: selection } = usePostSelectionQuery()
  const { meiUrl, scoreIri, baseUrl, isSelectionMode } = useSelector(state => state.score)
  const dispatch = useDispatch()
  dispatch(setTreatise(treatise.iri))

  return (
    <>
      <MeiViewer meiUrl={meiUrl} scoreIri={scoreIri} />

      {!isInspectorOpen && (
        <Tooltip title="Open inspector">
          <SpeedDial
            onClick={() => setIsInspectorOpen(true)}
            ariaLabel="Inspect"
            sx={{ position: 'absolute', top: 16, right: 16 }}
            icon={<Info />}
          />
        </Tooltip>
      )}
      <Inspector isOpen={isInspectorOpen} onChange={() => setIsInspectorOpen(!isInspectorOpen)} scoreIri={scoreIri} />

      {!isNavigatorOpen && (
        <Tooltip title="Open navigator">
          <SpeedDial
            onClick={() => setIsNavigatorOpen(true)}
            ariaLabel="Inspect"
            sx={{ position: 'absolute', top: 16, left: 16, '& .MuiSpeedDial-fab': { backgroundColor: purple[500] } }}
            icon={<Assignment />}
          />
        </Tooltip>
      )}
      <Navigator
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        treatise={treatise}
        scoreIri={scoreIri}
        baseUrl={baseUrl}
      />

      {!isSelectionMode && (
        <Tooltip title="Create new selection">
          <SpeedDial
            ariaLabel="New selection"
            onClick={() => dispatch(setSelectionMode())}
            sx={{ position: 'absolute', top: 84, right: 16, '& .MuiSpeedDial-fab': { backgroundColor: red[500] } }}
            icon={<Add />}
          />
        </Tooltip>
      )}
      <Editor />

      <Tooltip title="Back to home">
        <SpeedDial
          ariaLabel="Home"
          sx={{ position: 'absolute', top: 84, left: 16, '& .MuiSpeedDial-fab': { backgroundColor: green[500] } }}
          icon={<SpeedDialIcon icon={<Home />} openIcon={<ArrowBack />} />}
        />
      </Tooltip>
    </>
  )
}
