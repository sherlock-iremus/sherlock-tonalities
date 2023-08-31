/* eslint-disable react-hooks/exhaustive-deps */
import { MeiViewer } from './MeiViewer'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect, useState } from 'react'
import scores from '../../config/scores.json'
import { useDispatch } from 'react-redux'
import { setScoreAnnotator } from '../../services/globals'

export const ScoreAnnotator = () => {
  const { scoreId, projectId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [file, setFile] = useState(null)
  const dispatch = useDispatch()

  const getFile = async () => {
    if (state) setFile(await state.upload.text())
    else {
      const url = scores.find(score => score.scoreIri === getIri(scoreId))?.meiUrl
      if (!url) navigate('/')
      setFile(await (await fetch(url)).text())
    }
    dispatch(setScoreAnnotator({ scoreIri: getIri(scoreId), projectIri: getIri(projectId) }))
  }

  useEffect(() => {
    getFile()
  }, [])

  return file ? <MeiViewer {...{ file }} /> : null
}
