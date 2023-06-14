import { useSelector } from 'react-redux'
import { ContextChip } from '../../components/ContextChip'
import { useDeleteAnnotationMutation } from '../../services/service'
import { useGetAnnotationsQuery } from '../../services/sparql'
import { getModel, getUuid, removeBaseIri } from '../../utils'

export const ConceptItem = ({ assignment, concept, refetch }) => {
  const { scoreIri, projectIri } = useSelector(state => state.globals)
  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()

  const removeAssignment = async () => {
    try {
      await deleteAnnotation(getUuid(assignment)).unwrap()
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ContextChip
      key={concept}
      disabled={isLoading}
      onDelete={() => removeAssignment()}
      primary={removeBaseIri(concept)}
      secondary={getModel(concept)}
      sx={{ m: 0.2 }}
    />
  )
}
