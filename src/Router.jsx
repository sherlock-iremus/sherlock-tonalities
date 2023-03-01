import { useGetUserIdQuery } from './app/services/sherlockApi'
import { Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Landing } from './Landing'
import { ScoreAnnotator } from './features/score/ScoreAnnotator'

export const Router = () => {
  useGetUserIdQuery()
  const { isUserConnected } = useSelector(state => state.score)

  return (
    <Routes>
      {isUserConnected && <Route path="/score/:scoreId" element={<ScoreAnnotator />} />}
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
