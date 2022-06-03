import { Chip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedEntity } from '../../slice/scoreSlice'

export const ConceptItem = props => {
  const dispatch = useDispatch()
  const { treatiseIri } = useSelector(state => state.score)

  return (
    <Chip
      label={props.conceptIri.slice(treatiseIri.length)}
      onClick={() => dispatch(setInspectedEntity({ conceptIri: props.conceptIri }))}
      sx={{ m: 0.3 }}
    />
  )
}
