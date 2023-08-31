import { Avatar, Chip, Collapse, Stack, Tooltip, Typography, capitalize } from '@mui/material'
import { useDeleteAnnotationMutation, useGetUserIdQuery } from '../../services/service'
import { getModel, getUuid, removeBaseIri, timeSince } from '../../utils'
import { ContributorItem } from './ContributorItem'
import { useState } from 'react'
import { Annotation } from '../edition/Annotation'

export const Assignment = ({
  assignment,
  concept,
  comment,
  subentity,
  annotation,
  refetch,
  date,
  author,
  color,
  onPage,
}) => {
  const [deleteAnnotation, { isLoading }] = useDeleteAnnotationMutation()
  const { data: userId } = useGetUserIdQuery()

  const [isHovered, setIsHovered] = useState(false)

  const canDelete = userId === getUuid(author)

  const onDelete = async () => {
    try {
      await deleteAnnotation(getUuid(assignment)).unwrap()
      if (refetch) refetch()
    } catch (error) {
      console.log(error)
    }
  }

  if (subentity) return <Annotation entity={subentity} {...{ date, author, annotation }} isSubEntity color={!color} />
  else
    return (
      <Stack
        onMouseEnter={() => onPage && setIsHovered(true)}
        onMouseLeave={() => onPage && setIsHovered(false)}
        alignSelf={!onPage ? 'center' : canDelete ? 'flex-end' : 'flex-start'}
      >
        <Stack direction="row" spacing={1} alignItems="center" alignSelf={canDelete ? 'flex-end' : 'flex-start'}>
          <Chip
            sx={{
              height: 'auto',
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
                padding: 1,
              },
            }}
            disabled={isLoading}
            label={comment ? capitalize(comment) : removeBaseIri(concept)}
            color={concept ? 'primary' : 'default'}
            {...(canDelete && isHovered && { onDelete })}
            {...(concept && {
              avatar: (
                <Avatar sx={{ fontSize: 12, height: 24, width: 24 }}>
                  <Tooltip title={getModel(concept)}>
                    <span>{getModel(concept).charAt(0)}</span>
                  </Tooltip>
                </Avatar>
              ),
            })}
          />
          {onPage && <ContributorItem contributorIri={author} small />}
        </Stack>
        <Collapse in={isHovered} timeout="auto" unmountOnExit>
          <Typography variant="caption" display="block" textAlign="end" fontSize={10}>
            {timeSince(new Date(date))} ago
          </Typography>
        </Collapse>
      </Stack>
    )
}
