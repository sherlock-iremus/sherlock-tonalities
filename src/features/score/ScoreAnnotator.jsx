/** @jsxImportSource @emotion/react */

import { Add, Assignment, Info } from '@mui/icons-material'
import { SpeedDial, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Inspector } from './Inspector'
import { MeiViewer } from './MeiViewer'
import { Navigator } from './Navigator'
import { setSelectionMode } from '../../app/services/scoreSlice'
import { SelectionEditor } from './editor/SelectionEditor'
import { AnnotationEditor } from './editor/AnnotationEditor'
import { COLOR_INSPECTED, COLOR_NAVIGATE, COLOR_SELECTED } from './mei.css'
import { Navigate } from 'react-router-dom'

export const ScoreAnnotator = () => {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const { meiUrl, scoreIri, isSelectionMode, annotationEditor } = useSelector(state => state.score)
  const dispatch = useDispatch()

  return (
    <>
      {!scoreIri && <Navigate to="/" />}
      <MeiViewer meiUrl={meiUrl} scoreIri={scoreIri} />

      {!isInspectorOpen && (
        <Tooltip title="Open inspector">
          <SpeedDial
            onClick={() => setIsInspectorOpen(true)}
            ariaLabel="Inspect"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              '& .MuiSpeedDial-fab': { backgroundColor: COLOR_INSPECTED },
            }}
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
            sx={{ position: 'absolute', top: 16, left: 16, '& .MuiSpeedDial-fab': { backgroundColor: COLOR_NAVIGATE } }}
            icon={<Assignment />}
          />
        </Tooltip>
      )}
      <Navigator
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        scoreIri={scoreIri}
      />

      {!isSelectionMode && (
        <Tooltip title="Create new selection">
          <SpeedDial
            ariaLabel="New selection"
            onClick={() => dispatch(setSelectionMode())}
            sx={{
              position: 'absolute',
              top: 84,
              right: 16,
              '& .MuiSpeedDial-fab': { backgroundColor: COLOR_SELECTED },
            }}
            icon={<Add />}
          />
        </Tooltip>
      )}
      <SelectionEditor />

      <AnnotationEditor {...annotationEditor} />
    </>
  )
}
