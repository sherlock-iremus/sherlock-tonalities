import { ContextChip } from '../../components/ContextChip'
import { useDeleteAnnotationMutation } from '../../services/service'
import { getModel, getUuid, removeBaseIri } from '../../utils'

export const ConceptItem = ({ assignment, concept, refetch }) => {
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
