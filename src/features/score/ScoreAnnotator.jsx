/** @jsxImportSource @emotion/react */

import { BugReport } from '@mui/icons-material'
import { SpeedDial, Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { orange } from '@mui/material/colors'
import { getSherlockIriFromUuid } from './utils'
import { useEffect } from 'react'
import { setScore } from '../../app/services/scoreSlice'
import { useDispatch } from 'react-redux'
import scores from '../../app/scores.json'

export const ScoreAnnotator = () => {
  const { scoreUuid } = useParams()
  const dispatch = useDispatch()
  const { meiUrl, scoreIri } = useSelector(state => state.score)

  useEffect(() => {
    const scoreIri = getSherlockIriFromUuid(scoreUuid)
    const score = scores.find(score => score.scoreIri === scoreIri)
    score && dispatch(setScore(score))
  }, [dispatch, scoreUuid])

  return (
    <>
      <MeiViewer meiUrl={meiUrl} scoreIri={scoreIri} />

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
    </>
  )
}
