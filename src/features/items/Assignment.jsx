import { Avatar, Chip, Stack, Tooltip, Typography, capitalize } from '@mui/material'
import { useDeleteAnnotationMutation, useGetUserIdQuery } from '../../services/service'
import { getUuid, removeBaseIri } from '../../utils'
import { ContributorItem } from './ContributorItem'
import { useState } from 'react'
import { useGetModelsQuery } from '../../services/models'
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
  const { data: models } = useGetModelsQuery()
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

  const getModel = iri => models?.find(e => iri?.toLowerCase().includes(e.baseIri.toLowerCase())).name || ''

  if (subentity)
    return <Annotation entity={subentity} {...{ date, author, annotation, onDelete }} isSubEntity color={!color} />
  else
    return (
      <Stack
        onMouseEnter={() => onPage && setIsHovered(true)}
        onMouseLeave={() => onPage && setIsHovered(false)}
        alignSelf={!onPage ? 'center' : canDelete ? 'flex-end' : 'flex-start'}
      >
        <Stack
          direction={canDelete ? 'row' : 'row-reverse'}
          pl={1}
          spacing={1}
          alignItems="center"
          alignSelf={canDelete ? 'flex-end' : 'flex-start'}
        >
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
          <ContributorItem contributorIri={author} small />
        </Stack>
        {onPage && (
          <Typography variant="caption" display="block" textAlign="end" fontSize={10}>
            {new Date(date).toLocaleString('en-GB').slice(0, -3)}
          </Typography>
        )}
      </Stack>
    )
}
