import { useGetAnnotationSelectionQuery } from '../../../app/services/sparql'
import { StyleSelection } from './StyleSelection'

export const StyleAnnalyticalEntity = ({ annotationIri, mode }) => {
  const { data: selectionIri } = useGetAnnotationSelectionQuery(annotationIri)
  return selectionIri ? <StyleSelection {...{ selectionIri, mode }} /> : null
}
