/* eslint-disable react-hooks/exhaustive-deps */
import { MeiViewer } from './MeiViewer'
import { useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setScoreAnnotator } from '../../services/globals'

export const ScoreAnnotator = () => {
  const dispatch = useDispatch()
  const { scoreId, projectId } = useParams()
  const [file, setFile] = useState(null)

  const getFile = async () => {
    const scoreUrl = scores.find(score => score.scoreIri === getIri(scoreId))?.meiUrl
    if (scoreUrl) try {
      setFile(await (await fetch(scoreUrl)).text())
      dispatch(setScoreAnnotator(getIri(projectId)))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getFile()
  }, [])

  if (file) return <MeiViewer {...{ file }} />
  else return null
}
