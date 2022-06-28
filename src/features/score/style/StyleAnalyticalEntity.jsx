import { useGetAnnotationSelectionQuery } from '../../../app/services/sparql'
import { StyleSelection } from './StyleSelection'

export const StyleAnalyticalEntity = ({ analyticalEntityIri, mode }) => {
  const { data: selectionIri } = useGetAnnotationSelectionQuery(analyticalEntityIri)
  return selectionIri ? <StyleSelection {...{ selectionIri, mode }} /> : null
}
