/* eslint-disable react-hooks/exhaustive-deps */
import { useGetUserIdQuery } from './services/service'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ScoreAnnotator } from './features/score/ScoreAnnotator'
import { useEffect } from 'react'
import { Concepts } from './features/navigator/Concepts'
import { Landing } from './features/Landing'
import { MobileInfo } from './features/MobileInfo'

export const App = () => {
  useGetUserIdQuery()
  const navigate = useNavigate()
  const { isUserConnected } = useSelector(state => state.globals)

  useEffect(() => {
    if (window.innerWidth < 600) navigate('/mobile')
  }, [])

  return (
    <Routes>
      {window.innerWidth < 600 && <Route path="/mobile" element={<MobileInfo />} />}
      {isUserConnected && <Route path="/project/:projectId/score/:scoreId" element={<ScoreAnnotator />} />}
      <Route path="*" element={<Landing />} />
      <Route path="/models" element={<Concepts />} />
    </Routes>
  )
}
