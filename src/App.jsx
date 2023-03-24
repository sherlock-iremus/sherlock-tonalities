import { useGetUserIdQuery } from './app/services/sherlockApi'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Landing } from './Landing'
import { ScoreAnnotator } from './features/score/ScoreAnnotator'
import { ModelLibrary } from './features/ModelLibrary'
import { MobileInfo } from './MobileInfo'
import { useEffect } from 'react'

export const App = () => {
  useGetUserIdQuery()
  const navigate = useNavigate()
  const { isUserConnected } = useSelector(state => state.score)
  
  useEffect(() => {
    if (window.innerWidth < 600) navigate('/mobile')
  }, [])

  return (
    <Routes>
      {window.innerWidth < 600 && <Route path="/mobile" element={<MobileInfo />} />}
      {isUserConnected && <Route path="/score/:scoreId" element={<ScoreAnnotator />} />}
      <Route path="*" element={<Landing />} />
      <Route path="/models" element={<ModelLibrary />} />
    </Routes>
  )
}
