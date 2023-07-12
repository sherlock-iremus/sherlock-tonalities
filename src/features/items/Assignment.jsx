import { Chip, Collapse, Stack, Tooltip, capitalize } from '@mui/material'
import { useDeleteAnnotationMutation } from '../../services/service'
import { getModel, getUuid, removeBaseIri } from '../../utils'
import { ContributorItem } from './ContributorItem'
import { useState } from 'react'

export const Assignment = ({ assignment, concept, comment, refetch, date, author }) => {
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

  return (
    <>
      <Collapse in={isHovered} timeout="auto" unmountOnExit>
        <Chip
          label={new Date(date).toLocaleDateString('en-GB')}
          variant="outlined"
          size="small"
          sx={{
            position: 'absolute',
            zIndex: 1,
            '& .MuiChip-label': { fontSize: 9 },
            bgcolor: 'white',
            cursor: 'pointer',
            left: 40,
          }}
        />
      </Collapse>
      <Chip
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        clickable
        disabled={isLoading}
        icon={<ContributorItem contributorIri={author} />}
        label={comment ? capitalize(comment) : removeBaseIri(concept)}
        sx={{
          marginTop: 1,
          justifyContent: 'space-between',
          cursor: 'pointer',
          '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
          },
        }}
        {...(concept && { color: 'primary' })}
        {...(isHovered && { onDelete: removeAssignment })}
      />
    </>
  )
}
