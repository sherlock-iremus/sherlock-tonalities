/* eslint-disable react-hooks/exhaustive-deps */
import { MeiViewer } from './MeiViewer'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getIri } from '../../utils'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setScoreAnnotator } from '../../services/globals'
import { useGetScoreUrlQuery } from '../../services/sparql'

export const ScoreAnnotator = () => {
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const { data } = useGetScoreUrlQuery(getIri(projectId), { skip: state?.url })

  const getFile = async url => {
    try {
      setFile(await (await fetch(url)).text())
      dispatch(setScoreAnnotator({ projectIri: getIri(projectId), scoreIri: url }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (state?.url) getFile(state.url)
    else if (data) getFile(data)
  }, [data, state])

  if (file) return <MeiViewer {...{ file }} />
  else navigate('/')
}
