import { Chip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { getConceptLabel } from '../../../app/treatises/treatises'

export const ConceptItem = ({ conceptIri }) => {
  const dispatch = useDispatch()
  const { tonalityBaseUrl } = useSelector(state => state.score)

  return (
    <Chip
      label={getConceptLabel(conceptIri) || conceptIri.slice(tonalityBaseUrl.length)}
      onClick={() => dispatch(setInspectedEntity({ conceptIri }))}
      sx={{ m: 0.3 }}
    />
  )
}
