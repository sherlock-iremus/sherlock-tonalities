/* eslint-disable react-hooks/exhaustive-deps */
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect, useState } from 'react'
import scores from '../../config/scores.json'
import { useDispatch } from 'react-redux'
import { setScoreAnnotator } from '../../services/globals'

export const ScoreAnnotator = () => {
  const { scoreId, projectId } = useParams()
  const [score, setScore] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    setScore(scores.find(score => score.scoreIri === getIri(scoreId)))
    dispatch(setScoreAnnotator({ scoreIri: getIri(scoreId), projectIri: getIri(projectId) }))
  }, [])

  return <MeiViewer {...score} />
}
