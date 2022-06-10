import { Chip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedEntity } from '../../slice/scoreSlice'

export const ConceptItem = ({ conceptIri }) => {
  const dispatch = useDispatch()
  const { treatiseIri } = useSelector(state => state.score)

  return (
    <Chip
      label={conceptIri.slice(treatiseIri.length)}
      onClick={() => dispatch(setInspectedEntity({ conceptIri }))}
      sx={{ m: 0.3 }}
    />
  )
}
