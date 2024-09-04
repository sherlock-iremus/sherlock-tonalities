import { useGetUserIdQuery } from './services/service'
import { ScoreAnnotator } from './features/score/ScoreAnnotator'
import { useMemo } from 'react'
import { Landing } from './features/Landing'
import { ThemeProvider, createTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Error } from './features/Error'
import { colors } from './utils'

const router = createBrowserRouter(
  [
    { path: '*', element: <Landing />, errorElement: <Error /> },
    { path: '/project/:projectId', element: <ScoreAnnotator />, errorElement: <Error /> },
  ],
  {
    basename: '/tonalities',
  }
)

export const App = () => {
  useGetUserIdQuery()
  const { colorIndex } = useSelector(state => state.globals)
  const theme = useMemo(
    () => createTheme({ palette: { primary: colors[colorIndex], secondary: { main: colors[colorIndex][50] } } }),
    [colorIndex]
  )
  return (
    <ThemeProvider {...{ theme }}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
