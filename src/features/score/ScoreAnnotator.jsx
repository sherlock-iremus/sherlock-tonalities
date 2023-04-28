/* eslint-disable react-hooks/exhaustive-deps */
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect, useState } from 'react'
import scores from '../../config/scores.json'

export const ScoreAnnotator = () => {
  const { scoreId, projectId } = useParams()
  const [score, setScore] = useState(null)

  useEffect(() => {
    setScore(scores.find(score => score.scoreIri === getIri(scoreId)))
  }, [])

  return <MeiViewer {...score} {...{ projectId }} />
}
