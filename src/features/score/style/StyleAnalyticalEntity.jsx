import { useGetAnalyticalEntityQuery } from '../../../app/services/sparql'
import { StyleSelection } from './StyleSelection'

export const StyleAnalyticalEntity = ({ analyticalEntityIri }) => {
  const { data } = useGetAnalyticalEntityQuery(analyticalEntityIri)
  return data ? <StyleSelection {...data} /> : null
}
