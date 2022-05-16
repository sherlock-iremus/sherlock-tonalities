/** @jsxImportSource @emotion/react */

import { Assignment, Info } from '@mui/icons-material'
import { Avatar, IconButton, Tooltip } from '@mui/material'
import { blue, purple } from '@mui/material/colors'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Inspector } from './Inspector'
import { MeiViewer } from './MeiViewer'
import { Navigator } from './Navigator'

import treatise from '../../app/treatises/Zarlino_1588.json'
import { useGetTokenQuery } from '../../app/services/sherlockApi'
import { setTreatise } from '../slice/scoreSlice'

export const ScoreAnnotator = () => {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)
  const { meiUrl, scoreIri, baseUrl } = useSelector(state => state.score)
  const { data: token } = useGetTokenQuery()
  const dispatch = useDispatch()
  dispatch(setTreatise(treatise.iri))

  return (
    <>
      <MeiViewer meiUrl={meiUrl} scoreIri={scoreIri} />

      {!isInspectorOpen && (
        <Tooltip title="Inspector">
          <Avatar
            sx={{ position: 'absolute', top: 56, right: 16, bgcolor: blue[500] }}
            onClick={() => setIsInspectorOpen(true)}
          >
            <IconButton color="inherit">
              <Info />
            </IconButton>
          </Avatar>
        </Tooltip>
      )}
      <Inspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        scoreIri={scoreIri}
      />

      {!isNavigatorOpen && (
        <Tooltip title="Navigator">
          <Avatar
            sx={{ position: 'absolute', top: 56, left: 16, bgcolor: purple[500] }}
            onClick={() => setIsNavigatorOpen(true)}
          >
            <IconButton color="inherit">
              <Assignment />
            </IconButton>
          </Avatar>
        </Tooltip>
      )}
      <Navigator
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        treatise={treatise}
        scoreIri={scoreIri}
        baseUrl={baseUrl}
      />
    </>
  )
}
