import { useGetUserIdQuery } from './services/service'
import { Route, Routes } from 'react-router-dom'
import { ScoreAnnotator } from './features/score/ScoreAnnotator'
import { useMemo } from 'react'
import { Landing } from './features/Landing'
import { ThemeProvider, createTheme } from '@mui/material'
import { colors } from './features/ThemePicker'
import { useSelector } from 'react-redux'

export const App = () => {
  useGetUserIdQuery()
  const { colorIndex } = useSelector(state => state.globals)

  const theme = useMemo(
    () => createTheme({ palette: { primary: colors[colorIndex], secondary: { main: colors[colorIndex][50] } } }),
    [colorIndex]
  )

  return (
    <ThemeProvider {...{ theme }}>
      <Routes>
        <Route path="/project/:projectId/score/:scoreId" element={<ScoreAnnotator />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </ThemeProvider>
  )
}
