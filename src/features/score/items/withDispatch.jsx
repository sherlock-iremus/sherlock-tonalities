import { useDispatch, useSelector } from 'react-redux'

export const withDispatch = Component => props => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  return <Component {...props} {...{ dispatch, baseUrlLength }} />
}
