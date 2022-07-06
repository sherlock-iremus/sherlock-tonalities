import { useGetAnnotationSelectionQuery } from '../../../app/services/sparql'
import { StyleSelection } from './StyleSelection'

export const StyleAnalyticalEntity = ({ analyticalEntityIri }) => {
  const { data: selectionIri } = useGetAnnotationSelectionQuery(analyticalEntityIri)
  return selectionIri ? <StyleSelection {...{ selectionIri }} /> : null
}
