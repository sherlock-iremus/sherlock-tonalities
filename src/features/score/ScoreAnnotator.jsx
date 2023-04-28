/* eslint-disable react-hooks/exhaustive-deps */
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect } from 'react'
import { setScore } from '../../services/globals'
import { useDispatch } from 'react-redux'
import scores from '../../config/scores.json'

export const ScoreAnnotator = () => {
  const { scoreId, projectId } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    const scoreIri = getIri(scoreId)
    const score = scores.find(score => score.scoreIri === scoreIri)
    score && dispatch(setScore(score))
  }, [scoreId])

  return <MeiViewer {...{ projectId }} />
}
