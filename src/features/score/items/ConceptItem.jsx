import { Chip } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setInspectedConcept } from '../../slice/scoreSlice'

export const ConceptItem = props => {
  const dispatch = useDispatch()

  return (
    <Chip
      label={props.conceptIri.slice(props.treatiseIri.length)}
      onClick={() => dispatch(setInspectedConcept(props.conceptIri))}
      sx={{ m: 0.3 }}
    />
  )
}
