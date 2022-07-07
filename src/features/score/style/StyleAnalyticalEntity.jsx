import { useGetAnalyticalEntityQuery } from '../../../app/services/sparql'
import { StyleSelection } from './StyleSelection'

export const StyleAnalyticalEntity = ({ analyticalEntityIri }) => {
  const { data: selectionIri } = useGetAnalyticalEntityQuery(analyticalEntityIri)
  return selectionIri ? <StyleSelection {...{ selectionIri }} /> : null
}
