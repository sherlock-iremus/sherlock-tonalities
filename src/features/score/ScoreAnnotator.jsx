/** @jsxImportSource @emotion/react */

import { Assignment, BugReport, Info } from '@mui/icons-material'
import { SpeedDial, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Inspector } from './Inspector'
import { MeiViewer } from './MeiViewer'
import { Navigator } from './Navigator'
import { SelectionEditor } from './editor/SelectionEditor'
import { AnnotationEditor } from './editor/AnnotationEditor'
import { COLOR_INSPECTED, COLOR_NAVIGATE } from './mei.css'
import { Navigate } from 'react-router-dom'
import { AlertMessage } from './editor/AlertMessage'
import { orange } from '@mui/material/colors'

export const ScoreAnnotator = () => {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const { meiUrl, scoreIri, alerts } = useSelector(state => state.score)

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
              top: 40,
              right: 0,
              '& .MuiSpeedDial-fab': {
                backgroundColor: COLOR_INSPECTED,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
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
            sx={{
              position: 'absolute',
              top: 40,
              '& .MuiSpeedDial-fab': {
                backgroundColor: COLOR_NAVIGATE,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            }}
            icon={<Assignment />}
          />
        </Tooltip>
      )}
      <Navigator isOpen={isNavigatorOpen} onClose={() => setIsNavigatorOpen(false)} scoreIri={scoreIri} />

      <Tooltip title="Report bug">
        <SpeedDial
          onClick={() => window.open('https://github.com/sherlock-iremus/sherlock-tonalities/issues/new', '_blank')}
          ariaLabel="Report"
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            '& .MuiSpeedDial-fab': {
              backgroundColor: orange[700],
              borderRadius: 3,
            },
          }}
          icon={<BugReport />}
        />
      </Tooltip>

      <SelectionEditor />
      <AnnotationEditor />
      <AlertMessage {...alerts} />
    </>
  )
}
