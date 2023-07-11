import { ContextChip } from '../../components/ContextChip'
import { useDeleteAnnotationMutation } from '../../services/service'
import { getModel, getUuid, removeBaseIri } from '../../utils'

export const Assignment = ({ assignment, concept, comment, refetch }) => {
  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()

  const removeAssignment = async () => {
    try {
      await deleteAnnotation(getUuid(assignment)).unwrap()
      refetch()
    } catch (error) {
      console.log(error)
    }
  }

  if (concept)
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
  else if (comment)
    return (
      <ContextChip
        key={comment}
        disabled={isLoading}
        onDelete={() => removeAssignment()}
        primary={comment}
        sx={{ m: 0.2 }}
      />
    )
  else return null
}
