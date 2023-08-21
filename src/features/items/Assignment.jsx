import { Chip, capitalize } from '@mui/material'
import { useDeleteAnnotationMutation } from '../../services/service'
import { getUuid, removeBaseIri } from '../../utils'
import { ContributorItem } from './ContributorItem'
import { useState } from 'react'
import { Annotation } from '../edition/Annotation'

export const Assignment = ({ assignment, concept, comment, subentity, refetch, date, author }) => {
  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()
  const [isHovered, setIsHovered] = useState(false)

  const removeAssignment = async () => {
    try {
      await deleteAnnotation(getUuid(assignment)).unwrap()
      if (refetch) refetch()
    } catch (error) {
      console.log(error)
    }
  }
  if (subentity) return <Annotation annotation={assignment} entity={subentity} {...{ date, author }} isSubEntity />
  else
    return (
      <Chip
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        clickable
        disabled={isLoading}
        label={
          !isHovered
            ? comment
              ? capitalize(comment)
              : removeBaseIri(concept)
            : new Date(date).toLocaleDateString('en-GB')
        }
        sx={{
          justifyContent: 'space-between',
          maxWidth: 200,
          cursor: 'pointer',
          '& .MuiChip-label': { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' },
          '& .MuiTouchRipple-root': { flexShrink: 0 },
        }}
        {...(concept && { color: 'primary' })}
        {...(isHovered && { onDelete: removeAssignment, avatar: <ContributorItem contributorIri={author} /> })}
      />
    )
}
