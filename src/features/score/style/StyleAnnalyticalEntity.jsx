import { useGetAnnotationSelectionQuery } from '../../../app/services/sparql'
import { StyleSelection } from './StyleSelection'

export const StyleAnnalyticalEntity = props => {
  const { data: selection } = useGetAnnotationSelectionQuery(props.annotationIri)
  return selection ? <StyleSelection selectionIri={selection} /> : null
}
