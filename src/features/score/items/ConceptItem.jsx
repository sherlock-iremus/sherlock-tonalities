import { Chip } from '@mui/material'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetEntityTypeQuery } from '../../../app/services/sparql'
import { getConceptLabel } from '../../../app/treatises/treatises'

export const ConceptItem = ({ conceptIri }) => {
  const dispatch = useDispatch()
  const {
    baseUrl,
    analyticalEntityEditor: { selectionIri },
  } = useSelector(state => state.score)
  const label = getConceptLabel(conceptIri) || (!conceptIri.match(baseUrl) && conceptIri)
  const { data } = useGetEntityTypeQuery(conceptIri, { skip: label })
  return (
    <Chip
      label={label || data?.label || 'Entity'}
      onClick={() => dispatch(setInspectedEntity({ conceptIri }))}
      sx={{ m: 0.3 }}
      {...(selectionIri && { onDelete: () => dispatch(setInspectedEntity({ propertyIri: conceptIri })) })}
    />
  )
}
