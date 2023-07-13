import { Chip, Collapse, Stack, Typography, capitalize } from '@mui/material'
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
    <Chip
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      clickable
      disabled={isLoading}
      label={
        <Stack overflow="hidden">
          <Collapse in={!isHovered} timeout="auto" unmountOnExit>
            <Typography variant="caption">{comment ? capitalize(comment) : removeBaseIri(concept)}</Typography>
          </Collapse>
          <Collapse in={isHovered} timeout="auto" unmountOnExit>
            <Typography variant="caption">
              {concept && getModel(concept)}, {new Date(date).toLocaleDateString('en-GB')}
            </Typography>
          </Collapse>
        </Stack>
      }
      sx={{
        cursor: 'pointer',
        justifyContent: 'space-between',
      }}
      {...(concept && { color: 'primary' })}
      {...(isHovered && { onDelete: removeAssignment, avatar: <ContributorItem contributorIri={author} /> })}
    />
  )
}
