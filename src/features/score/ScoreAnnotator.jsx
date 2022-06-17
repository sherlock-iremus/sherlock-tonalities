/** @jsxImportSource @emotion/react */

import { Add, Assignment, Info } from '@mui/icons-material'
import { SpeedDial, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Inspector } from './Inspector'
import { MeiViewer } from './MeiViewer'
import { Navigator } from './Navigator'
import treatise from '../../app/treatises/Zarlino_1588.json'
import { setSelectionMode, setTreatise } from '../../app/services/scoreSlice'
import { Editor } from './Editor'
import { AnnotationEditor } from './creator/AnnotationEditor'
import { COLOR_INSPECTED, COLOR_NAVIGATE, COLOR_SELECTED } from './mei.css'

export const ScoreAnnotator = () => {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const { meiUrl, scoreIri, baseUrl, isSelectionMode, annotationEditor } = useSelector(state => state.score)
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
        treatise={treatise}
        scoreIri={scoreIri}
        baseUrl={baseUrl}
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
      <Editor />

      <AnnotationEditor {...annotationEditor} />
    </>
  )
}
